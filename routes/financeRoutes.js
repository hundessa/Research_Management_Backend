import express from "express";
import {
  getFinanceNotifications,
  getFinanceReport,
  getFinanceRequests,
  financeRequestProcessed,
} from "../controllers/financeControllers.js";

const financeRoutes = express.Router();

financeRoutes.get("/finance-requests", getFinanceRequests);
financeRoutes.get("/finance-report/:researchId", getFinanceReport);
financeRoutes.patch("/finance-requests/:researchId/process", financeRequestProcessed);
financeRoutes.get("/finance-notifications", getFinanceNotifications);

export default financeRoutes;