import express from "express";
import { getFinanceNotifications, sendFinanceNotification } from "../../controllers/finance_controllers/financeNotificationController.js";

const financeNotificationRoute = express.Router();

financeNotificationRoute.get(
  "/finance-notifications",
  getFinanceNotifications
);
financeNotificationRoute.post(
  "/finance-notifications",
  sendFinanceNotification
);

export default financeNotificationRoute;
