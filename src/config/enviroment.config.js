import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URL: "mongodb+srv://Gonza88:olakease88@cluster0.6hwivlp.mongodb.net/",
  MONGO_SESSION_SECRET: process.env.MONGO_SESSION_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
};
