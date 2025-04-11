import express from "express";
import loginController from "../controllers/Login_Controller/loginController";

const loginRoute = express.Router();

loginRoute.post("/login", loginController);

export default loginRoute;
