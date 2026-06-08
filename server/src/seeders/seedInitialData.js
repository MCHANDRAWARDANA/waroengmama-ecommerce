import db from "../config/database.js";
import { Category, Product } from "../models/index.js";

const seedInitialData = async () => {
  try {
    await db.sync({ alter: true });

    const categoriesCount = await Category.count();
    const productsCount = await Product.count();

    if (categoriesCount === 0) {
      const categories = await Category.bulkCreate([
        { name: "Sembako" },
        { name: "Minuman" },
        { name: "Snack" },
        { name: "Kebutuhan Bayi" },
        { name: "Kebutuhan Harian" },
        { name: "Gas LPG" },
      ]);

      console.log(`Seed kategori berhasil: ${categories.length}`);
    }

    if (productsCount === 0) {
      const allCategories = await Category.findAll();

      const getCategoryId = (name) =>
        allCategories.find((item) => item.name === name)?.id;

      const products = [
        {
          name: "Indomie Goreng",
          price: 3500,
          stock: 120,
          description: "Mie instan favorit untuk kebutuhan harian.",
          image: null,
          categoryId: getCategoryId("Sembako"),
        },
        {
          name: "Aqua 600ml",
          price: 4000,
          stock: 80,
          description: "Air mineral segar untuk minum sehari-hari.",
          image: null,
          categoryId: getCategoryId("Minuman"),
        },
        {
          name: "Chitato Mini",
          price: 7000,
          stock: 50,
          description: "Snack ringan buat teman santai.",
          image: null,
          categoryId: getCategoryId("Snack"),
        },
        {
          name: "Pampers M",
          price: 55000,
          stock: 20,
          description: "Popok bayi nyaman untuk pemakaian harian.",
          image: null,
          categoryId: getCategoryId("Kebutuhan Bayi"),
        },
        {
          name: "Sabun Mandi Lifebuoy",
          price: 8500,
          stock: 35,
          description: "Sabun mandi harian dengan aroma segar.",
          image: null,
          categoryId: getCategoryId("Kebutuhan Harian"),
        },
        {
          name: "Gas LPG 3kg",
          price: 22000,
          stock: 15,
          description: "Gas elpiji untuk kebutuhan memasak.",
          image: null,
          categoryId: getCategoryId("Gas LPG"),
        },
      ];

      const createdProducts = await Product.bulkCreate(products);
      console.log(`Seed produk berhasil: ${createdProducts.length}`);
    }

    console.log("Initial data siap.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedInitialData();
