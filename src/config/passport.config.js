import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hash.utils.js";
import { adminModel } from "../dao/models/admin.model.js";
import config from "../config/enviroment.config.js";
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

const githubClientId = config.GITHUB_CLIENT_ID;
const githubClientSecret = config.GITHUB_CLIENT_SECRET;
const githubCallbackUrl = config.GITHUB_CALLBACK_URL;

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (
            username == "adminCoder@coder.com" &&
            password == "adminCod3r123"
          ) {
            const user = await adminModel.findOne({ email: username });
            if (!user) {
              const user = await adminModel.create({
                email: "adminCoder@coder.com",
                password: createHash(password),
                role: "admin",
              });
              return done(null, user);
            }
            return done(null, user);
          }

          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {
          if (email == "adminCoder@coder.com") {
            return done(null, false);
          }

          const user = await userModel.findOne({ email: username });

          if (user) {
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            role: "user",
          };

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Error:", err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.fcc7092cab00b5f6",
        clientSecret: "80baa076984a8d2fc33bb2748c559a2cf5ea8f05",
        callbackURL: "http://localhost:8080/api/sessions/github/callback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name.split(" ")[0],
              last_name: profile._json.name.split(" ")[1],
              email: profile._json.email,
              password: "",
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (err) {
          return done("Error ACA:", err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    const user = await userModel.findById(_id);
    done(null, user);
  });
};

export default initializePassport;
