import dotenv from "dotenv"
dotenv.config()
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, CLIENT_REQUEST_EMAIL_TEMPLATE, AGENT_REQUEST_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { sender, mailtrapClient } from "./mailtrap.config.js"
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: 'jhhbidpksrqcmbku',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
    tls: {
        rejectUnauthorized: false
    }
});
export const sendVerificationEmail = async (email, verificationToken) => {
    console.log("reacched2")
    const emailContent = VERIFICATION_EMAIL_TEMPLATE(verificationToken);
    const mailOptions2 = {
        from: 'joelayomide35@gmail.com',
        to: email,
        subject: 'Your Order',
        html: emailContent,
    };
    console.log(mailOptions2);

    try {
        transporter.sendMail(mailOptions2, async (error, info) => {
            if (error) {
                console.error("Error" + error);

            } else {
                console.log("Sent mail")
            }

        })
        // const response = await mailtrapClient.testing
        //     .send({
        //         from: sender,
        //         to: recipient,
        //         subject: "Verify your email",
        //         html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        //         category: " Email Verification"
        //     })
        // console.log("Email sent Sucessfully", response)
    }
    catch (error) {
        console.error("Error sending verification", error)
        throw new Error(`Error sending verification email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const emailContent = WELCOME_EMAIL_TEMPLATE(name);
    const mailOptions2 = {
        from: 'joelayomide35@gmail.com',
        to: email,
        subject: 'Your Order',
        html: emailContent,
    };


    try {
        transporter.sendMail(mailOptions2, async (error, info) => {
            if (error) {
                console.error("Error" + error);

            } else {
                console.log("welcome Email sent Sucessfully")
            }

        })
        // const response = await mailtrapClient.testing
        //     .send({
        //         from: sender,
        //         to: recipient,
        //         subject: "Succefuly Signed IN",
        //         html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
        //         category: " Welcome"
        //     })

    } catch (error) {
        console.error("Error Welcome", error)
        throw new Error(`Error sending Welcome email: ${error}`)
    }
}
export const sendPasswordRestEmail = async (email, resetURL) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.testing
            .send({
                from: sender,
                to: recipient,
                subject: "Rest your passowrd",
                html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
                category: "Password Rest"
            })
        console.log("Successfuly sent rest password", response)
    } catch (error) {
        console.error("Error ", error)
        throw new Error(`Error sending reset password email: ${error}`)
    }
}
export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.testing
            .send({
                from: sender,
                to: recipient,
                subject: "Password Successfully Updated",
                html: PASSWORD_RESET_SUCCESS_TEMPLATE,
                category: "Password Updated"
            })
        console.log("Successfuly sent updated password", response)
    } catch (error) {
        console.error("Error ", error)
        throw new Error(`Error sending update password email: ${error}`)
    }
}

export const sendRequestDetailsEmail = async (user, requestDetails, agentDetails) => {
    // Import the email templates
    const userEmailContent = CLIENT_REQUEST_EMAIL_TEMPLATE(user.name, requestDetails, agentDetails);
    const agentEmailsContent = agentDetails.map((agent) =>
      AGENT_REQUEST_EMAIL_TEMPLATE(agent.name, user, requestDetails)
    );
  
    try {
      // Send email to the user with agent details
      const userMailOptions = {
        from: 'joelayomide35@gmail.com',
        to: user.email,
        subject: 'Your Request Details & Matched Agents',
        html: userEmailContent,
      };
  
      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending user email:", error);
        } else {
          console.log("User email sent successfully:", info.response);
        }
      });
  
      // Send emails to all matched agents with user details
      agentDetails.forEach((agent, index) => {
        const agentMailOptions = {
          from: 'joelayomide35@gmail.com',
          to: agent.email,
          subject: 'New Client Request Matched with You',
          html: agentEmailsContent[index],
        };
  
        transporter.sendMail(agentMailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email to agent ${agent.name}:`, error);
          } else {
            console.log(`Email sent to agent ${agent.name} successfully:`, info.response);
          }
        });
      });
    } catch (error) {
      console.error("Error sending request emails:", error);
      throw new Error(`Error sending request emails: ${error}`);
    }
  };
  