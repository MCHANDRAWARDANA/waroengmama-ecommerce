import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/mine", verifyToken, getMyOrders);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, verifyAdmin, getOrderById);
router.post("/", createOrder);
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

export default router;
