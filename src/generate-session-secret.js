import fs from "fs";
import crypto from "crypto";

const sessionSecret = crypto.randomBytes(64).toString("hex");

fs.writeFileSync(".env", `MONGO_SESSION_SECRET=${sessionSecret}\n`, {
  flag: "a",
});
console.log("La cadena secreta se ha generado y agregado a tu archivo .env.");
