import twilio from "twilio";
import config from "../config/enviroment.config.js";
import logger from "./logger.util.js";

const TWILIO_ACCOUNT_SID = config.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = config.AUTH_TOKEN; // Nota que aquí usamos AUTH_TOKEN, no TWILIO_AUTH_TOKEN

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

try {
  await client.messages.create({
    body: `This is a test message.`,
    from: "+16189613519",
    to: "+541133923399",
  });
} catch (err) {
  logger.error(`Catch error: ${err}`);
}
