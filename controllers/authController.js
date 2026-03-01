import asyncHandler from "../utils/asyncHandler.js";

const signUpController = asyncHandler(async (req, res) => {
  const result = await signUpService(req.body);
  res.status(201).json(result);
});

const loginController = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);
  res.cookie("token", result.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});
  res.status(200).json(result);
});
  
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Set headers to prevent caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.status(200).json({ message: "Logged out successfully" });
};

export { signUpController, loginController, logoutUser };
