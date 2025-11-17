import express from "express";
import signUpController from "../controllers/signupController.js";

const signUpRoute = express.Router();

signUpRoute.post("/signup", signUpController);

export default signUpRoute;
