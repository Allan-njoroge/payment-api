import { Request, Response } from "express";
import { logger } from "src/utils";
import { CustomError } from "src/utils/errors";
import { TokenService } from "src/services/tokens.service";
import { RefreshTokenType, ValidateTokenType } from "src/schema/tokens.schema";
import { resolveJWTSecretAndType, verifyJWT } from "src/utils/tokens";

const tokenService = new TokenService();


/**
 * @desc     Validates a provided JWT token
 * @route    POST /api/token/validate-token
 * @param    req - Express Request containing token and type in body
 * @param    res - Express Response with decoded token or error message
 */
export const validateToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token, type }: ValidateTokenType = req.body;
  try {
    const {jwt_secret, type: tokenType} = resolveJWTSecretAndType(type)
    const verifyToken = await verifyJWT(token, jwt_secret)
    const {statusCode} = await tokenService.validateToken({ token, type: tokenType});

    return res.status(statusCode).json({decodedToken: verifyToken.decoded});
  } catch (error: any) {
    logger.error(`Failed to validate token: ${error}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * @desc     Refreshes access and refresh tokens using a valid refresh token
 * @route    POST /api/token/refresh
 * @param    req - Express Request containing refresh token and userId
 * @param    res - Express Response with new tokens or error message
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const {token, userId }: RefreshTokenType = req.body
    try {
      const {newTokens, statusCode} = await tokenService.refreshToken({token, userId})
      return res.status(statusCode).json({
        tokens: {
            access: newTokens.accessToken,
            refresh: newTokens.refreshToken
        }
    })
  } catch (error: any) {
    logger.error(`Failed to refresh token: ${error}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
