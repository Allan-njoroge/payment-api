import Africastalking from "africastalking";
import { AFRICAS_TALKING_API_KEY, AFRICAS_TALKING_USERNAME } from "src/config";


export const africastalking = Africastalking({
  apiKey: AFRICAS_TALKING_API_KEY as string,
  username: AFRICAS_TALKING_USERNAME as string,
});