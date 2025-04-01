type AuthMessageTypes = {
    verification_code: number;
  };
  
  export const authMessage = ({
    verification_code,
  }: AuthMessageTypes): string => {
    const message: string = `Hello,

    We are pleased to have you at Payment API. 
    To complete you registration, please verify you account.

    Your verification code is:${verification_code}

    Best Regards
    Payment API Team
    `;
    return message;
  };
  