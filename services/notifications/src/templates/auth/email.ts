type AuthEmailTypes = {
  email_address: string;
  verification_code: number;
};

export const authEmail = ({
  email_address,
  verification_code,
}: AuthEmailTypes): string => {
  const email: string = `
    <b>Hello ${email_address}</b>,
    <br/>
    <p>
      We are pleased to have you at Payment API. To complete you registration, please verify you account.
      <br/>
      Your verification code is: <span style="color: #7c3aed">${verification_code}</span>
    </p>
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
