import express from "express";
import { approveFinanceRequest, getFinanceRequests } from "../controllers/directorate_controllers/directorateFinanceController";
import { createNotification, getDirectorateNotifications } from "../controllers/directorate_controllers/directorateNotificationController";

const directorateRoutes = express.Router();

directorateRoutes.get("/finance-requests", getFinanceRequests);
directorateRoutes.patch("/finance-requests/:requestId/approve", approveFinanceRequest);
// directorateRoutes.patch("/finance-requests/:requestId/reject", rejectFinanceRequest);
directorateRoutes.get("/notifications", getDirectorateNotifications);
directorateRoutes.post("/notifications", createNotification);

export default directorateRoutes;