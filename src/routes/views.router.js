import { Router } from "express";
import {
  home,
  login,
  register,
  chat,
  products,
  product,
  cart,
  carts,
  restore,
} from "../controllers/views.controller.js";

import roleAuth from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", home);
router.get("/login", login);
router.get("/register", register);
router.get("/chat", chat);
router.get("/products", products);
router.get("/product/:pid", product);
router.get("/cart", carts);
router.get("/cart/:cid", cart);
router.get("/restore", roleAuth("user"), restore);

export default router;
