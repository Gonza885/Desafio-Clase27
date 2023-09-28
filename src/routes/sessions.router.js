import { Router } from "express";
import {
  login,
  register,
  current,
  logout,
  restore,
  restoreCallback,
  github,
  githubCallback,
  premium,
  user,
} from "../controllers/sessions.controller.js";
import roleAuth from "../middlewares/role.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/current", current);
router.get("/github", github);
router.get("/githubCallback", githubCallback);
router.post("/logout", roleAuth(["premium", "user"]), logout);
router.post("/restore", roleAuth(["premium", "user"]), restore);
router.post("/restoreCallback", roleAuth(["premium", "user"]), restoreCallback);
router.post("/premium/:uid", roleAuth("admin"), premium);
router.post("/user/:uid", roleAuth("admin"), user);

export default router;
