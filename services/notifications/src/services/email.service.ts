import logger from "src/utils/logger";
import { transport } from "src/config/email.config";
import { EMAIL_NAME, EMAIL_USERNAME } from "src/config";

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const result = await transport.sendMail({
      from: `${EMAIL_NAME} ${EMAIL_USERNAME}`,
      to,
      subject,
      text,
      html,
    });
    logger.info("Send email: ", result);
  } catch (error) {
    logger.error("Error sending email: ", error);
  }
};
