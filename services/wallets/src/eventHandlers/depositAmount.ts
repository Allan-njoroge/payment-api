import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../services/prisma";
import logger from "../utils/logger";
import { publishEvent } from "../services/rabbitmq";
import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

type DepositDetails = {
  amount: number;
  wallet_address: string;
  reference?: string;
  date?: Date;
  depositor_email_address: string;
  depositor_phone_number?: string;
  depositor_name: string
};

export const depositAmount = async (event: {
  deposit_details: DepositDetails;
}) => {
  try {
    const {
      depositor_name,
      depositor_email_address,
      depositor_phone_number,
      wallet_address,
      amount,
      reference,
      date,
    } = event.deposit_details;
    let user;

    const existingWallet = await prisma.wallet.findUnique({
      where: { wallet_address },
      select: { user_id: true, amount: true },
    });

    if (!existingWallet) {
      logger.error("This wallet does not exist");
      return;
    }

    const newBalance = new Decimal(existingWallet.amount).plus(
      new Decimal(amount)
    );
    await prisma.wallet.update({
      data: { amount: newBalance },
      where: { wallet_address },
    });

    // Fetch the recepient details using an API call to the accounts service
    try {
      const apiUrl = `${process.env.BASE_SERVER_URL}/api/accounts/${existingWallet.user_id}`
      logger.info("API_URL: ", apiUrl)
      const response: any = await axios.get(apiUrl);

      if(!response) {
        logger.error("No response found")
        return
      }

      user = await response.data.user;
      logger.info("Got response from account API");
      logger.info(response)
      logger.info(response.data)
      logger.info(response.data.user)

      // Publish an event to send a notification to the recepient account holder
      await publishEvent("deposit.success", {
        recepient_name: user.first_name + " " + user.last_name,
        recepient_email_address: user.email_address,
        recepient_phone_number: user.phone_number,
        depositor_email_address,
        depositor_phone_number,
        wallet_address,
        reference,
        amount,
        new_balance: newBalance,
        date,
      });

      // publish an event to the depositer account holder
      await publishEvent("deposit.success", {
        depositor_name,
        depositor_email_address,
        depositor_phone_number,
        recepient_name: user.first_name + " " + user.last_name,
        wallet_address,
        reference,
        amount,
        date,
      });
    } catch (error: any) {
      logger.error("Hello",error.response);
    }

    // publish an event to the depositer account holder
    await publishEvent("deposit.failed", {
      depositor_email_address,
      depositor_phone_number,
      amount,
      wallet_address,
      recepient_name: user.first_name + " " + user.last_name,
    });

    logger.info(
      `Deposited ${amount} to wallet ${wallet_address}. New balance: ${newBalance}`
    );
  } catch (error: any) {
    logger.error("Error depositing amount", error);
  }
};
