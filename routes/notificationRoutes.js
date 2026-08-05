import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUserNotifications } from "../controllers/notificationControllers.js";

const notificationRoutes = express.Router();

notificationRoutes.get(
  "/",
  authMiddleware,
  getUserNotifications
);

export default notificationRoutes;