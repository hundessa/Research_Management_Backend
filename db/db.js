import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { MONGO_URI } from "../config/config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");

    // Admin seeding
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin@ha", 10);
      const newAdmin = new User({
        firstname: "admin",
        lastname: "adminn",
        username: "admin",
        email: "admin@mail.com",
        phonenumber: "0909090909",
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log("Default admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("MongoDB connection or admin setup failed:", error);
    process.exit(1);
  }
};