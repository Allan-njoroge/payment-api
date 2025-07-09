import { sendEmail } from "src/services/email.service";
import logger from "src/utils/logger";
import { authEmail } from "src/templates/auth/email";
import { sendSMS } from "src/services/message.service";
import { authMessage } from "src/templates/auth/message";

type EventType = {
  phoneNumber?: string,
  emailAddress: string,
  firstName: string,
  verificationCode: number ,
}

export const sendVerificationCodeEvent = async ({emailAddress, phoneNumber, verificationCode, firstName}: EventType) => {
  try {
    await sendEmail({
      to: emailAddress,
      subject: "Payment API - COMPLETE REGISTRATION PROCESS",
      html: authEmail({
        firstName,
        verificationCode,
      }),
    });

    if (phoneNumber) {
      await sendSMS({
        phoneNumber: phoneNumber,
        message: authMessage({ firstName, verificationCode }),
      });
    }
  } catch (error: any) {
    logger.error("Failed to send verification code", error);
  }
};
