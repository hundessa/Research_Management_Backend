import express from "express";
import { approveFinanceRequest, getFinanceRequests } from "../../controllers/finance_controllers/financeFinanceController.js";

const financeFinanceRoute = express.Router();

financeFinanceRoute.get("/finance/finance-requests", getFinanceRequests);
financeFinanceRoute.patch("/finance/finance-requests/:requestId/approve", approveFinanceRequest);
// financeFinanceRoute.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);

export default financeFinanceRoute;
