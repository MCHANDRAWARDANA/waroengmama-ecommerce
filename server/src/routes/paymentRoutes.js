import express from "express";
import {
  createMidtransToken,
  handleMidtransNotification,
  syncMidtransStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/midtrans/token", createMidtransToken);
router.post("/midtrans/notification", handleMidtransNotification);
router.post("/midtrans/sync-status/:orderId", syncMidtransStatus);

export default router;
