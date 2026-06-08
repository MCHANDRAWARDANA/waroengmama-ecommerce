import { Category } from "../models/index.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Success",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Kategori sudah ada" });
    }

    const category = await Category.create({ name });

    return res.status(201).json({
      message: "Kategori berhasil dibuat",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    await category.destroy();

    return res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
