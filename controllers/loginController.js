import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

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


export { loginController, logoutUser};
