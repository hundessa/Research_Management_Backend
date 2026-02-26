import express from 'express';
import { loginController, signUpController, logoutUser } from '../controllers/authController.js';

authRoutes = express.Router();

authRoutes.post("/login", loginController);
authRoutes.post("/signup", signUpController);

export default authRoutes;