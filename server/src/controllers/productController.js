import { Op } from "sequelize";
import { Product, Category } from "../models/index.js";

export const getAllProducts = async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 1000 } = req.query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (category) {
      where.categoryId = category;
    }

    const products = await Product.findAndCountAll({
      where,
      include: [{ model: Category }],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Success",
      data: products.rows,
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    return res.json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !stock || !categoryId) {
      return res.status(400).json({ message: "Field wajib belum lengkap" });
    }

    const product = await Product.create({
      name,
      price,
      stock,
      description,
      categoryId,
      image,
    });

    return res.status(201).json({
      message: "Produk berhasil dibuat",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const image = req.file ? req.file.filename : product.image;

    await product.update({
      name: req.body.name ?? product.name,
      price: req.body.price ?? product.price,
      stock: req.body.stock ?? product.stock,
      description: req.body.description ?? product.description,
      categoryId: req.body.categoryId ?? product.categoryId,
      image,
    });

    return res.json({
      message: "Produk berhasil diperbarui",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await product.destroy();

    return res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
