import Africastalking from "africastalking";
import dotenv from "dotenv";
dotenv.config();

export const africastalking = Africastalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY as string,
  username: process.env.AFRICAS_TALKING_USERNAME as string,
});