import express from "express";
import { getCoordinatorNotifications, sendCoordinatorNotification } from "../../controllers/coordinator_controller/coordinatorNotificationController.js";

const coordinatorNotificationRoute = express.Router();

coordinatorNotificationRoute.post(
  "/coordinator-notifications",
  sendCoordinatorNotification
);
coordinatorNotificationRoute.get(
  "/coordinator-notifications",
  getCoordinatorNotifications
);

export default coordinatorNotificationRoute;
