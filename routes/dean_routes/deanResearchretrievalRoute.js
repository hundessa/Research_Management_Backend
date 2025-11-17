import express from "express";
import { deanResearchRetrievalController, DeanGetResearchById } from "../../controllers/dean_controllers/deanResearchRetrievalController.js";
import deanStatusUpdateController from "../../controllers/dean_controllers/deanStatusUpdateController.js";

const deanResearchRetrievalRoute = express.Router();

deanResearchRetrievalRoute.get(
  "/dean/researches-list",
  deanResearchRetrievalController
);

deanResearchRetrievalRoute.get(
  "/dean/researches-list/:id",
  DeanGetResearchById
);

deanResearchRetrievalRoute.patch(
  "/dean/researches-list/:id",
  deanStatusUpdateController
);


export default deanResearchRetrievalRoute;

