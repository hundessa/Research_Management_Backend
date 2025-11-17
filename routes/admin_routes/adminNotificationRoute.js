import express from "express";
import {getAdminNotifications, sendAdminNotification } from "../../controllers/admin_controller/adminNotificationController.js";

const adminNotificationRoute = express.Router();

adminNotificationRoute.get("/admin/notification", getAdminNotifications);

adminNotificationRoute.post("/admin/notification", sendAdminNotification);


export default adminNotificationRoute;