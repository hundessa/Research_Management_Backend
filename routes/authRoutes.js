import express from 'express';
import { loginController, signUpController, logoutUser } from '../controllers/authController.js';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post("/login", loginController);
authRoutes.post("/signup", authMiddleware, authorizeRoles("admin"), signUpController);

export default authRoutes;