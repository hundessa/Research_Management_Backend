import express from "express";
import { DeanGetResearchById, deanResearchRetrievalController } from "../controllers/dean_controllers/deanResearchRetrievalController";
import deanStatusUpdateController from "../controllers/dean_controllers/deanStatusUpdateController";
import { createDeanNotification, getDeanNotificationController } from "../controllers/dean_controllers/deanNotificationController";

const deanRoutes = express.Router();

deanRoutes.get("/researches", deanResearchRetrievalController);
deanRoutes.get("/researches/:id", DeanGetResearchById);
deanRoutes.patch("/researches/:id/status", deanStatusUpdateController);
deanRoutes.get("/notifications", getDeanNotificationController);
deanRoutes.post("/notifications", createDeanNotification);

export default deanRoutes;