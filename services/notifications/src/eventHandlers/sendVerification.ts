import { sendEmail } from "../services/email.service";
import logger from "../utils/logger";
import { authEmail } from "../templates/auth/email";
import { sendSMS } from "../services/message.service";
import { authMessage } from "../templates/auth/message";

export const sendVerificationCodeEvent = async (event: {
  phone_number?: string;
  email_address: string;
  verification_code: number;
}) => {
  try {
    await sendEmail({
      to: event.email_address,
      subject: "Payment API - COMPLETE REGISTRATION PROCESS",
      html: authEmail({
        email_address: event.email_address,
        verification_code: event.verification_code,
      }),
    });

    if (event.phone_number) {
      await sendSMS({
        phoneNumber: event.phone_number,
        message: authMessage({ verification_code: event.verification_code }),
      });
    }
  } catch (error: any) {
    logger.error("Failed to send verification code", error);
  }
};
