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
      status: 'active'
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



const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      user: {
        id: user._id,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
    console.log(user.role);
    
  } catch (error) {
    console.log("Error during login", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Set headers to prevent caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.status(200).json({ message: "Logged out successfully" });
};


export { signUpController, loginController, logoutUser};
