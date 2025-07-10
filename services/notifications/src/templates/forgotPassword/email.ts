import { CLIENT_DOMAIN } from "src/config";

type ForgotPasswordEmailType = {
  firstName: string;
  userId: string;
  verificationCode: number;
};

export const forgotPasswordEmail = ({firstName, userId, verificationCode}: ForgotPasswordEmailType): string => {
  const url: string = `${CLIENT_DOMAIN}/${userId}/${verificationCode}`
  const email: string = `
    <b>Hello ${firstName}</b>,
    <br/>
    <p>
      To complete your password reset process, please use the verification code below or click the link below
      <br/>
      Your verification code is: <span style="color: #7c3aed">${verificationCode}</span>
    </p>
    <br/>
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