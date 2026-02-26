import express from "express";
import { approveFinanceRequest, getFinanceRequests } from "../controllers/directorateControllers.js";
import { getFinanceNotifications, sendFinanceNotification } from "../controllers/financeControllers.js";

const financeRoutes = express.Router();

financeRoutes.get("/finance-requests", getFinanceRequests);
financeRoutes.patch("/finance-requests/:requestId/approve", approveFinanceRequest);
// financeRoutes.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);
financeRoutes.get("/finance-notifications", getFinanceNotifications);
financeRoutes.post("/finance-notifications", sendFinanceNotification);

export default financeRoutes;