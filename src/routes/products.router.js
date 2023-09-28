import { Router } from "express";
import {
  product,
  products,
  insertProduct,
  editProduct,
  eraseProduct,
  mockingProducts,
} from "../controllers/products.controller.js";

import roleAuth from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", products);
router.get("/:pid", product);
router.post("/", roleAuth(["admin", "premium"]), insertProduct);
router.put("/:pid", roleAuth(["admin", "premium"]), editProduct);
router.delete("/:pid", roleAuth(["admin", "premium"]), eraseProduct);
router.post(
  "/mockingproducts",
  roleAuth(["admin", "premium"]),
  mockingProducts
);

export default router;
