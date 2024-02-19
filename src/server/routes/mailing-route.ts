import { Request, Response } from "express";

export const sendContactUsMail = async (req: Request, res: Response) => {
  const { email, firstName, lastName, message, phone } = req.body;
  const emailOrPhone = email || phone;
  const inValid = !email || !firstName || !lastName || !message || !emailOrPhone;
  if (inValid) return res.status(400).json({ message: "Provide the required fields" });

  const mailText = `
  Contact us form message:

  ${message}

  Name: ${firstName || ""} ${lastName || ""}
  Phone: ${phone || ""}
  Email: ${email || ""}
  `;
  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_SES_REGION,
    endpoint: process.env.AWS_SES_ENDPOINT,
    credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
  });

  ses.sendEmail(
    {
      Destination: { ToAddresses: ["tci.homebase.tc@gmail.com"] },
      Message: {
        Body: {
          Html: { Data: mailText },
          Text: { Data: mailText }
        },
        Subject: {
          Data: "Contact us form"
        }
      },
      Source: process.env.AWS_SES_EMAIL_ADDRESS
    },
    (emailFailedError, data) => {
      if (emailFailedError?.message) {
        console.log("Email Failed To Send Error", emailFailedError.message);
        return res.status(500).json({ message: "Oops Something went wrong, form failed to send", success: false });
      } else {
        return res.json({ message: "success", success: true });
      }
    }
  );
};
