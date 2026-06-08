import { Order, OrderItem, Product } from "../models/index.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    return res.json({ data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      note,
      items,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !paymentMethod ||
      !items ||
      !items.length
    ) {
      return res.status(400).json({ message: "Data order belum lengkap" });
    }

    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      note,
      totalAmount,
      status: "pending",
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    await OrderItem.bulkCreate(orderItems);

    for (const item of items) {
      const product = await Product.findByPk(item.id);
      if (product) {
        await product.update({
          stock: Math.max(0, product.stock - item.quantity),
        });
      }
    }

    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem }],
    });

    return res.status(201).json({
      message: "Order berhasil dibuat",
      data: createdOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    await order.update({ status });

    return res.json({
      message: "Status order berhasil diperbarui",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    await OrderItem.destroy({ where: { orderId: order.id } });
    await order.destroy();

    return res.json({ message: "Order berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        customerEmail: req.user.email,
      },
      include: [{ model: OrderItem }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};