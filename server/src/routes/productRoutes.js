import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateProduct,
);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
