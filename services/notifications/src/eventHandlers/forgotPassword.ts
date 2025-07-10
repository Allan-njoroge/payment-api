import { sendEmail } from "src/services/email.service";
import { forgotPasswordEmail } from "src/templates/forgotPassword/email";
import logger from "src/utils/logger";

type ForgotPasswordType = {
  firstName: string;
  emailAddress: string;
  userId: string;
  verificationCode: number;
};

export const forgotPasswordEvent = async ({firstName, emailAddress, userId, verificationCode }: ForgotPasswordType) => {
  try {
    await sendEmail({
          to: emailAddress,
          subject: "Payment API - COMPLETE PASSWORD RESET PROCESS",
          html: forgotPasswordEmail({
            firstName,
            userId,
            verificationCode,
          }),
        });
  } catch (error: any) {
    logger.error(`Failed to send forgot password notfication: ${error}`);
  }
};
