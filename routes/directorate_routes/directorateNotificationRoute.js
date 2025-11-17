import express from "express";
import {createNotification, getDirectorateNotifications} from "../../controllers/directorate_controllers/directorateNotificationController.js"

const directorateNotificationRoute = express.Router();

directorateNotificationRoute.get("/directorate-notifications", getDirectorateNotifications);
directorateNotificationRoute.post("/directorate-notifications", createNotification);

export default directorateNotificationRoute;