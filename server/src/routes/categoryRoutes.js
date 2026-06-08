import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", verifyToken, verifyAdmin, createCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

export default router;
