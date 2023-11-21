import { Router } from "express";
import {
  carts,
  cart,
  insertCart,
  insertProduct,
  editCart,
  editProduct,
  clearCart,
  clearProduct,
  purchase,
} from "../controllers/carts.controller.js";
import roleAuth from "../middlewares/role.middleware.js";
import { addToCart } from "../controllers/carts.controller.js";

const router = Router();

router.get("/", roleAuth("admin"), carts);
router.get("/:cid", roleAuth(["admin", "premium", "user"]), cart);
router.post("/", roleAuth(["admin", "premium"]), insertCart);
router.post("/:cid/product/:pid", roleAuth(["premium", "user"]), insertProduct);
router.put("/:cid", roleAuth(["premium", "user"]), editCart);
router.put("/:cid/product/:pid", roleAuth(["premium", "user"]), editProduct);
router.delete("/:cid", roleAuth(["premium", "user"]), clearCart);
router.delete(
  "/:cid/product/:pid",
  roleAuth(["premium", "user"]),
  clearProduct
);
router.post("/:cid/purchase", roleAuth(["premium", "user"]), purchase);
router.post("/add-to-cart", addToCart);

export default router;
