import express from "express";
import { approveFinanceRequest, getFinanceRequests } from "../../controllers/directorate_controllers/directorateFinanceController.js";

const directorateFinanceRoute = express.Router();

directorateFinanceRoute.get("/directorate/finance-requests", getFinanceRequests);
directorateFinanceRoute.patch("/directorate/finance-requests/:requestId/approve", approveFinanceRequest);
// directorateFinanceRoute.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);

export default directorateFinanceRoute;
