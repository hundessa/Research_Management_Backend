import express from 'express';
import { loginController, signUpController, logoutUser } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post("/login", loginController);
authRoutes.post("/signup", signUpController);

export default authRoutes;