type AuthEmailTypes = {
  first_name: string;
  last_name: string;
  verification_code: number;
};

export const authEmail = ({
  first_name,
  last_name,
  verification_code,
}: AuthEmailTypes): string => {
  const email: string = `
    <b>Hello ${first_name} ${last_name}</b>,
    <br/>
    <p>We are pleased to have you at Payment API. To complete you registration, please verify you account.
    Your verification code is: <span style="color: #7c3aed">${verification_code}</span></p>
    `;
  return email;
};
