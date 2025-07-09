import { TokenType } from "@prisma/client";
import { RefreshTokenType, ValidateTokenType } from "src/schema/tokens.schema";
import { decrypt, logger, prisma } from "src/utils";
import { CustomError } from "src/utils/errors";
import {
  generateTokens,
  resolveJWTSecretAndType,
  verifyJWT,
} from "src/utils/tokens";

type isBlacklistedType = {
  token: string;
  type: TokenType;
};

type ValidateTokenPayloadType = {
  token: ValidateTokenType["token"];
  type: TokenType;
};

export class TokenService {
  async isBlacklisted({ token, type }: isBlacklistedType) {
    const blacklistedToken = await prisma.blacklistedToken.findFirst({
      where: { token, type },
    });

    if (blacklistedToken) return true;
    return false;
  }

  async validateToken(data: ValidateTokenPayloadType) {
    const { token, type } = data;
    const blacklistedToken = await this.isBlacklisted({ token, type });

    if (blacklistedToken)
      throw new CustomError(401, "Invalid or blacklisted token");
    return { statusCode: 200 };
  }

  async findRefreshTokenByUserId(userId: string) {
    const existingToken = await prisma.refreshToken.findFirst({
      where: { user_id: userId },
    });

    if (!existingToken) throw new CustomError(404, "No token found");

    const decryptedToken = decrypt(existingToken.refresh_token);
    return { statusCode: 200, decryptedToken };
  }

  async refreshToken(data: RefreshTokenType) {
    const { token, userId } = data;
    const { decryptedToken } = await this.findRefreshTokenByUserId(userId);

    if (decryptedToken != token) {
      throw new CustomError(403, "Invalid or expired token");
    }

    const { jwt_secret } = resolveJWTSecretAndType("refresh");
    
    try{
        await verifyJWT(token, jwt_secret);
    } catch(error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.statusCode, error.message);
        }
        logger.error(error)
        throw new CustomError(403, "Token validate failed")
    }
    const newTokens = await generateTokens(userId);

    return {
      statusCode: 201,
      newTokens,
    };
  }
}
