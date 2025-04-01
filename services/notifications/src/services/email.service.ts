import dotenv from 'dotenv'
import logger from '../utils/logger';
import { transport } from '../config/email.config';
dotenv.config()


type EmailOptions = {
    to: string;
    subject: string;
    text?: string;
    html: string;
}

export const sendEmail = async({ to, subject, text, html}: EmailOptions) => {
    try {
        const result = await transport.sendMail({
            from: process.env.EMAIL_USERNAME,
            to,
            subject,
            text,
            html
        });
        logger.info("Send email: ", result)
    } catch (error) {
        logger.error("Error sending email: ", error);
    }
}