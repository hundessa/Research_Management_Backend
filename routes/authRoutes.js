import express from 'express';
import { loginController } from '../controllers/loginController';
import signUpController from '../controllers/signupController';

authRoutes = express.Router();

authRoutes.post("/login", loginController);
authRoutes.post("/signup", signUpController);

export default authRoutes;