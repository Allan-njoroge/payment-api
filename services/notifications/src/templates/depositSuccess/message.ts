import { DepositorSuccessMessageType, DepositRecepientSuccessMessageType } from "../../utils/types";

export const depositRecepientSuccessMessage = ({
  depositor_name,
  recepient_name,
  wallet_address,
  reference,
  date,
  amount,
  new_balance,
}: DepositRecepientSuccessMessageType): string => {
  return `Hi ${recepient_name}, you've received a deposit of $${amount.toFixed(
    2
  )} from ${depositor_name}.

Wallet: ${wallet_address}
Reference: ${reference}
Date: ${new Date(date).toLocaleString()}
New Balance: $${new_balance.toFixed(2)}

Thank you for using Payment API.`;
};

// Success Message that is sent to the depositing account
export const depositorSuccessMessage = ({
  depositor_name,
  recepient_name,
  wallet_address,
  reference,
  date,
  amount
}: DepositorSuccessMessageType): string => {
  return `Hi ${depositor_name}, your deposit of $${amount.toFixed(
    2
  )} to ${recepient_name} was successful.

Wallet: ${wallet_address}
Reference: ${reference}
Date: ${new Date(date).toLocaleString()}

Thanks for using Payment API`;
};
