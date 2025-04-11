import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const signUpController = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const preUser = await User.findOne({ email });

    if (preUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Account created",
      role: newUser.role,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default signUpController;
