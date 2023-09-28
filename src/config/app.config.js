import dotenv from "dotenv";

dotenv.config();

let enviroment = process.env.NODE_ENV;
if (!enviroment) enviroment = "development";

let persistence;

if (enviroment.trim() === "local") {
  persistence = "memory";
} else {
  persistence = "mongo";
}

export default persistence;
