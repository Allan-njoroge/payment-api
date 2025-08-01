import { CLIENT_DOMAIN } from "src/config";

type AuthEmailTypes = {
  firstName: string;
  userId: string;
  verificationCode: number;
};

export const authEmail = ({userId, firstName, verificationCode}: AuthEmailTypes): string => {
  const url: string = `${CLIENT_DOMAIN}/${userId}/${verificationCode}`
  const email: string = `
    <b>Hello ${firstName}</b>,
    <br/>
    <p>
      We are pleased to have you at Payment API. To complete you registration, please verify you account.
      <br/>
      Your verification code is: <span style="color: #7c3aed">${verificationCode}</span>
    </p>
    <>Or you can click the link below <p> 
    <a href=${url} target="_blank">${url}</a>
    <br/> 
    <p><b>NOTE: </b> This code is valid for 10 minutes</p>
    <br/><br/>
    <p>
      Best Regards
      <br/>
      Payment API Team
    </p>
    `;
  return email;
};
