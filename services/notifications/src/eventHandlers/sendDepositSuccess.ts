import { sendEmail } from "src/services/email.service";
import { sendSMS } from "src/services/message.service";
import {
  depositRecepientSuccessEmail,
  depositorSuccessEmail,
} from "src/templates/depositSuccess/email";
import {
  depositorSuccessMessage,
  depositRecepientSuccessMessage,
} from "src/templates/depositSuccess/message";
import logger from "src/utils/logger";
import { DepositRecepientSuccessType } from "src/utils/types";

export const sendDepositSuccessEvent = async (
  event: DepositRecepientSuccessType
) => {
  try {
    // Email to the recepient
    await sendEmail({
      to: event.recepient_email_address,
      subject: "Deposit Successful",
      html: depositRecepientSuccessEmail({
        depositor_name: event.depositor_name,
        recepient_name: event.recepient_name,
        wallet_address: event.wallet_address,
        reference: event.reference,
        date: event.date,
        amount: event.amount,
        new_balance: event.new_balance,
      }),
    });

    /*
     * Add message to the send the message if there is a phone number
     */
    if (event.recepient_phone_number) {
      await sendSMS({
        phoneNumber: event.depositor_phone_number,
        message: depositRecepientSuccessMessage({
          depositor_name: event.depositor_name,
          recepient_name: event.recepient_name,
          wallet_address: event.wallet_address,
          reference: event.reference,
          date: event.date,
          amount: event.amount,
          new_balance: event.new_balance,
        }),
      });
    }

    // Send success email to the depositor
    await sendEmail({
      to: event.depositor_email_address,
      subject: "Deposit Successful",
      html: depositorSuccessEmail({
        depositor_name: event.depositor_name,
        recepient_name: event.recepient_name,
        wallet_address: event.wallet_address,
        reference: event.reference,
        date: event.date,
        amount: event.amount,
      }),
    });

    /*
     * Add message to the send the message if there is a phone number
     */
    if (event.depositor_phone_number) {
      await sendSMS({
        phoneNumber: event.depositor_phone_number,
        message: depositorSuccessMessage({
          depositor_name: event.depositor_name,
          recepient_name: event.recepient_name,
          wallet_address: event.wallet_address,
          reference: event.reference,
          date: event.date,
          amount: event.amount,
        }),
      });
    }
  } catch (error: any) {
    logger.error("Failed to send deposit success message");
  }
};
