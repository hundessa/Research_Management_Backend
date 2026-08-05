import express from "express";
import { getFinanceNotifications, getFinanceReport, getFinanceRequests } from "../controllers/financeControllers.js";

const financeRoutes = express.Router();

financeRoutes.get("/finance-requests", getFinanceRequests);
financeRoutes.get("/finance-report", getFinanceReport);
// financeRoutes.patch("/finance-requests/:requestId/approve", approveFinanceRequest);
// financeRoutes.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);
financeRoutes.get("/finance-notifications", getFinanceNotifications);

export default financeRoutes;