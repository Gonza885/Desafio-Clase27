import { createTransport } from "nodemailer";
import config from "../config/enviroment.config.js";

const PORT = config.PORT;
const HOST = config.HOST;
const EMAIL = config.EMAIL;
const EMAIL_PASSWORD = config.EMAIL_PASSWORD;

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export const sendTicketEmail = async (ticket) => {
  try {
    const userEmail = ticket.purchaser.email;
    const orderCode = ticket.code;
    const orderAmount = ticket.amount;

    const emailContent = {
      from: EMAIL,
      to: `${userEmail}`,
      subject: "Thanks for your order",
      html: `
			<div>
				<p>Your order was processed</p>
				<p>Order code: ${orderCode}</p>
				<p>Total: $${orderAmount}</p>
			</div>
			`,
    };

    await transporter.sendMail(emailContent);
    return;
  } catch (error) {
    return `${error}`;
  }
};

export const sendRestoreEmail = async (restoreEmail) => {
  try {
    const emailContent = {
      from: EMAIL,
      to: `${restoreEmail}`,
      subject: "Create new password",
      html: `
			<div>
				<p>To create a new password, visit this link:</p>
				<a href="http://localhost:${PORT}/restore">Create new password</a>
				<p>The link expires in 1 hour</p>
			</div>
			`,
    };

    await transporter.sendMail(emailContent);
    return;
  } catch (error) {
    return `${error}`;
  }
};
