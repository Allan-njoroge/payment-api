export type DepositRecepientSuccessType = {
  recepient_email_address: string;
  recepient_phone_number: string,
  recepient_name: string;
  depositor_email_address: string;
  depositor_phone_number: string;
  depositor_name: string;
  wallet_address: string;
  reference: string;
  date: Date;
  new_balance: number;
  amount: number;
};

export type DepositRecepientSuccessEmailType = Pick<
  DepositRecepientSuccessType,
  | "depositor_name"
  | "recepient_name"
  | "wallet_address"
  | "reference"
  | "date"
  | "amount"
  | "new_balance"
>;

export type DepositorSuccessEmailType = Pick<
  DepositRecepientSuccessType,
  | "depositor_name"
  | "recepient_name"
  | "wallet_address"
  | "reference"
  | "date"
  | "amount"
>;

export type DepositRecepientSuccessMessageType = Pick<
  DepositRecepientSuccessType,
  | "depositor_name"
  | "recepient_name"
  | "wallet_address"
  | "reference"
  | "date"
  | "amount"
  | "new_balance"
>;

export type DepositorSuccessMessageType = Pick<
  DepositRecepientSuccessType,
  | "depositor_name"
  | "recepient_name"
  | "wallet_address"
  | "reference"
  | "date"
  | "amount"
>;
