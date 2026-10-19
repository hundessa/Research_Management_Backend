import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { MONGO_URI } from "../config/config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Seed a default admin user if one doesn't exist yet
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@mail.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin@ha";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const newAdmin = new User({
        firstname: "Admin",
        lastname: "User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "active",
      });
      await newAdmin.save();
      console.log("Default admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("MongoDB connection or admin setup failed:", error.message);
    process.exit(1);
  }
};
