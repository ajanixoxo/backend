// Looking to send emails in production? Check out our Email API/SMTP product!
import { MailtrapClient, MailtrapTransport } from  "mailtrap";
import Nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const TOKEN = process.env.MAIL_TRAP_TOKEN;
//const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({
    token: TOKEN,
    // endpoint:ENDPOINT,
    testInboxId:2267876,
  });

export const sender = {
  email: "hello@example.com",
  name: "Adeoluwa",
};





// const transport = Nodemailer.createTransport(
//     MailtrapTransport({
//       token: TOKEN,
//       testInboxId: 2267876,
//     })
//   );
  
//   const sender = {
//     address: "hello@example.com",
//     name: "Mailtrap Test",
//   };
//   const recipients = [
//     "joelayomide35@gmail.com",
//   ];
  
//   transport
//     .sendMail({
//       from: sender,
//       to: recipients,
//       subject: "You are awesome!",
//       text: "Congrats for sending test email with Mailtrap!",
//       category: "Integration Test",
//       sandbox: true
//     })
//     .then(console.log, console.error);
  
// const client = new MailtrapClient({
//   token: TOKEN,
//   testInboxId: 2267876,
// });

