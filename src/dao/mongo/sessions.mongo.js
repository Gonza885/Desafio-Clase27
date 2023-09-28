import passportCall from "../../utils/passport.utils.js";
import { hashPassword, isValidPassword } from "../../utils/hash.utils.js";
import { sendRestoreEmail } from "../../utils/email.utils.js";
import { userModel } from "./models/user.model.js";
import { faker } from "@faker-js/faker/locale/es";

class SessionsMongoDAO {
  constructor() {}

  async getLoginDao(req, res) {
    try {
      return await passportCall(req, res, "login");
    } catch (error) {
      return `${error}`;
    }
  }

  async getRegisterDao(req, res) {
    try {
      return await passportCall(req, res, "register");
    } catch (error) {
      return `${error}`;
    }
  }

  async getGithubDao(req, res) {
    try {
      return await passportCall(req, res, "github");
    } catch (error) {
      return `${error}`;
    }
  }

  async getGithubCallbackDao(req, res) {
    try {
      return await passportCall(req, res, "github");
    } catch (error) {
      return `${error}`;
    }
  }

  async getLogoutDao(req, res) {
    try {
      return req.session.destroy();
    } catch (error) {
      return `${error}`;
    }
  }

  async getRestoreDao(req, res) {
    try {
      const { user } = req.session;
      const restoreEmail = user.email;
      if (!restoreEmail)
        return `User doen't have an email to send the request.`;

      const cookieId = faker.database.mongodbObjectId();
      res.cookie("restoreCookie", cookieId, {
        signed: true,
        maxAge: 60 * 60 * 1000,
      });
      return await sendRestoreEmail(restoreEmail);
    } catch (error) {
      return `${error}`;
    }
  }

  async getRestoreCallbackDao(req, res) {
    try {
      const { user } = req.session;
      const { email, password } = req.body;
      if (isValidPassword(user, password))
        return `Can't restore with the same password.`;
      const newPassword = hashPassword(password);
      res.clearCookie("restoreCookie");
      return await userModel.updateOne({ email }, { password: newPassword });
    } catch (error) {
      return `${error}`;
    }
  }

  async getPremiumDao(req, res) {
    try {
      const { uid } = req.params;
      const user = userModel.findById(uid);
      if (!user) return `User doesn't exist.`;
      return await userModel.updateOne({ _id: uid }, { role: "premium" });
    } catch (error) {
      return `${error}`;
    }
  }

  async getUserDao(req, res) {
    try {
      const { uid } = req.params;
      const user = userModel.findById(uid);
      if (!user) return `User doesn't exist.`;
      return await userModel.updateOne({ _id: uid }, { role: "user" });
    } catch (error) {
      return `${error}`;
    }
  }
}

const MongoDAO = new SessionsMongoDAO();
export default MongoDAO;
