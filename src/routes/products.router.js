import { Router } from "express";
import {
  getProductById,
  products,
  product,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", products);
router.get("/:id", product);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
