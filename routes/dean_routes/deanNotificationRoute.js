import express from "express";
import {
  getDeanNotificationController,
  createDeanNotification,
} from "../../controllers/dean_controllers/deanNotificationController.js";


const deanNotificationRoute = express.Router();

deanNotificationRoute.get("/dean/notifications", getDeanNotificationController);
deanNotificationRoute.post("/dean/notifications", createDeanNotification);


export default deanNotificationRoute;