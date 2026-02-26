import express from "express";
import { approveFinanceRequest, getFinanceRequests } from "../controllers/finance_controllers/financeFinanceController";
import { getFinanceNotifications, sendFinanceNotification } from "../controllers/finance_controllers/financeNotificationController";

const financeRoutes = express.Router();

financeRoutes.get("/finance-requests", getFinanceRequests);
financeRoutes.patch("/finance-requests/:requestId/approve", approveFinanceRequest);
// financeRoutes.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);
financeRoutes.get("/finance-notifications", getFinanceNotifications);
financeRoutes.post("/finance-notifications", sendFinanceNotification);

export default financeRoutes;