import express from "express";
import { deanResearchRetrievalController, deanResearchStatusUpdateController, getDeanNotificationController, createDeanNotification, DeanGetResearchById } from "../controllers/deanControllers.js";
// import {  } from "../controllers/deanControllers.js";

const deanRoutes = express.Router();

deanRoutes.get("/researches", deanResearchRetrievalController);
deanRoutes.get("/researches/:id", DeanGetResearchById);
deanRoutes.patch("/researches/:id/status", deanResearchStatusUpdateController);
deanRoutes.get("/notifications", getDeanNotificationController);
deanRoutes.post("/notifications", createDeanNotification);

export default deanRoutes;