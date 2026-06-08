import bcrypt from "bcrypt";
import db from "../config/database.js";
import { User } from "../models/index.js";

const seedAdmin = async () => {
  try {
    await db.sync();

    const adminEmail = "admin@waroengmama.com";
    const existingAdmin = await User.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin sudah ada");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin WaroengMAMA",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin berhasil dibuat");
    console.log("Email: admin@waroengmama.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Seed admin gagal:", error);
    process.exit(1);
  }
};

seedAdmin();
