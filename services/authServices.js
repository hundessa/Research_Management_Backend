import bcrypt from "bcryptjs";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";


export const signUpService = async (userData) => {
  const { firstname, lastname, email, password, role } = userData;

  const preUser = await User.findOne({ email });

  if (preUser) {
    throw new AppError("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role,
    status: "active",
  });

  return {
    message: "Account created",
    user: {
      id: newUser.id,
      role: newUser.role,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    },
  };
};

export const loginService = async (loginData) => {
  const { email, password } = loginData;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect password", 401);
    }

    const token = jwt.sign({id: user.id, role: user.role}, JWT_SECRET, {expiresIn: "1d"});

    return {
      message: "Login successful",
      token,
      user: {
          id: user._id,
          role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    };
};
