import { Router } from "express";
import {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  updateCart,
  updateProductInCart,
  deleteCart,
  deleteProductFromCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/", getCarts);
router.get("/:id", getCartById);
router.post("/", createCart);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid", updateCart);
router.put("/:cid/product/:pid", updateProductInCart);
router.delete("/:id", deleteCart);
router.delete("/:cid/products/:pid", deleteProductFromCart);

export default router;
