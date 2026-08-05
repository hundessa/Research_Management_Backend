import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { JWT_SECRET } from "../config/config.js";
import AppError from "../utils/AppError.js";


export const authMiddleware = asyncHandler(async(req, res, next) => {

    const token = req.cookies?.token;
    console.log("Cookies received:", req.cookies);

    if(!token) {
        throw new AppError("Not logged in", 401);
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if(!decodedToken.id) {
        // return res.status(401).json({ message: "Unauthorized" });
        throw new AppError("Unauthorized", 401);
    }
    req.user = { id: decodedToken.id, role: decodedToken.role };
    next();

})

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};