type AuthMessageTypes = {
  firstName: string;
  verificationCode: number;
};

export const authMessage = ({ firstName, verificationCode }: AuthMessageTypes): string => {
  const message: string = `
    Hello ${firstName},

    We are pleased to have you at Payment API. 
    To complete you registration, please verify you account.

    Your verification code is:${verificationCode}

    Best Regards
    Payment API Team
    `;
  return message;
};
