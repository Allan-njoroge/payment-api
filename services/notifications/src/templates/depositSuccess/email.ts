import { DepositRecepientSuccessEmailType, DepositorSuccessEmailType } from "../../utils/types";

export const depositRecepientSuccessEmail = ({
  depositor_name,
  recepient_name,
  wallet_address,
  reference,
  date,
  amount,
  new_balance,
}: DepositRecepientSuccessEmailType): string => {
  return `
    <p>Hello, ${recepient_name}<p>

    <br/>
    <p>A deposit has been made in your account: Here are the details</p>
    <p><b>From: </b>${depositor_name}</p>
    <p><b>To Wallet: </b>${wallet_address}</p>
    <p><b>Reference: </b>${reference}</p>
    <p><b>Date: </b>${date}</p>

    <br/>
    <p><b>Amount Recieved: </b>${amount}</p>
    <p><b>Wallet Balance: </b>${new_balance}</p>

    <br/><br/>
    <p>Thank you for being part of Payment API. If you have any questions feel free to reach out to us</p>
    `;
};

export const depositorSuccessEmail = ({
  depositor_name,
  recepient_name,
  wallet_address,
  reference,
  date,
  amount
}: DepositorSuccessEmailType) => {
  return `
  <p>Hello, ${depositor_name}<p>
  
  <br/>
  <p>You have made a deposit to one of our accounts. Here are the details</p>
  <p><b>To: </b>${recepient_name}</p>
  <p><b>wallet Address: </b>${wallet_address}</p>
  <p><b>Amount: </b>${amount}</p>
  <p><b>Refernce: </b>${reference}</p>
  <p><b>Date: </b>${date}</p>

  </br><br/>
  <p>If you have any question feel free to reach out to us</p>
  `;
};
