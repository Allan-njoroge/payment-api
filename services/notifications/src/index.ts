import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

import { sendSMS } from "./services/message.service";
import { sendEmail } from "./services/email.service";

const app = express();
dotenv.config();

const welcomeEmail = () => {
  let contact_details = [
    { emailAddress: "allanballer254@gmail.com", name: "Muchai Thiaka" },
    { emailAddress: "allandavis254@gmail.com", name: "Allan Njoroge" },
  ];

  contact_details.map((contact) => {
    const subject = "WELCOME ON BOARD";
    let html = `
    <b>Hello ${contact.name}</b>,
    <br/>
    <p>We are pleased to have you at Payment API. To complete you registration, please verify you account.
    Your verification code is: <span style="color: orange, font-weight: bold">456356</span></p>
    <br/><br/>
    <p><b>NOTE: </b> This code expires in 10 minutes</p>
    `;;
    sendEmail({ to: contact.emailAddress, subject, html });
  });
};

// welcomeEmail()

const welcomeMessage = () => {
  let contact_details = [
    { phone: "+254776744754", name: "Muchai Thiaka" },
    { phone: "+254700056642", name: "Allan Njoroge" },
  ];

  contact_details.map((contact) => {
    let message = `Hello ${contact.name},
        Welcome to Payment API
        `;
    sendSMS({
      phoneNumber: contact.phone,
      message,
    });
  });
};

// welcomeMessage()

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  logger.info(`server is running in http://localhost:${PORT}`);
});
