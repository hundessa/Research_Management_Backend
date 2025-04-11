import express from "express";
import signUpController from "../controllers/Signup_Controller/signupController";

const signUpRoute = express.Router();

signUpRoute.post("/signup", signUpController);

export default signUpRoute;
