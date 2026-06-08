import { Order, OrderItem } from "../models/index.js";
import snap, { coreApi } from "../services/midtransService.js";

const paymentMethodsMap = {
  QRIS: ["qris"],
  "Transfer Bank": ["bca_va", "bni_va", "permata_va", "echannel", "other_va"],
  "Bayar di Warung": ["indomaret", "alfamart"],
};

const mapTransactionStatus = (transactionStatus, fraudStatus) => {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "paid" : "pending";
  }

  if (transactionStatus === "settlement") return "paid";
  if (["cancel", "deny", "expire"].includes(transactionStatus))
    return "cancelled";
  if (transactionStatus === "pending") return "pending";

  return "pending";
};

export const createMidtransToken = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId wajib diisi" });
    }

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const itemDetails = (order.OrderItems || []).map((item) => ({
      id: String(item.productId),
      price: Number(item.price),
      quantity: Number(item.quantity),
      name: item.productName,
    }));

    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: Number(order.totalAmount),
      },
      customer_details: {
        first_name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      item_details: itemDetails,
      enabled_payments: paymentMethodsMap[order.paymentMethod] || undefined,
      callbacks: {
        finish: `http://localhost:5173/orders/success/${order.id}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return res.json({
      message: "Token Midtrans berhasil dibuat",
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      },
    });
  } catch (error) {
    console.error("MIDTRANS TOKEN ERROR:", error);
    return res.status(error.httpStatusCode || 500).json({
      message: error.message,
      details: error.ApiResponse || null,
    });
  }
};

export const syncMidtransStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const statusResponse = await coreApi.transaction.status(order.orderNumber);

    const newStatus = mapTransactionStatus(
      statusResponse.transaction_status,
      statusResponse.fraud_status,
    );

    await order.update({ status: newStatus });

    return res.json({
      message: "Status order berhasil disinkronkan",
      data: {
        orderId: order.id,
        status: newStatus,
        midtrans: statusResponse,
      },
    });
  } catch (error) {
    console.error("MIDTRANS SYNC STATUS ERROR:", error);
    return res.status(error.httpStatusCode || 500).json({
      message: error.message,
      details: error.ApiResponse || null,
    });
  }
};

export const handleMidtransNotification = async (req, res) => {
  try {
    const notification = req.body;

    const order = await Order.findOne({
      where: { orderNumber: notification.order_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const newStatus = mapTransactionStatus(
      notification.transaction_status,
      notification.fraud_status,
    );

    await order.update({ status: newStatus });

    return res.json({ message: "Notification processed" });
  } catch (error) {
    console.error("MIDTRANS NOTIF ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
