import express from "express";
import { assignDefenseDateController, assignReviewersController, coordinatorResearchRetrivalController, getCoordinatorSingleResearchController, getCoordinatorUsersController, makeFinalDecision } from "../../controllers/coordinator_controller/coordinatorResearchRetrievalController.js";

const coordinatorResearchRoute = express.Router();

coordinatorResearchRoute.get(
  "/coordinator-researches-list",
  coordinatorResearchRetrivalController
);

coordinatorResearchRoute.get(
  "/coordinator-researches-list/:id",
  getCoordinatorSingleResearchController
);

coordinatorResearchRoute.patch(
  "/coordinator-researches-list/:id",
  assignReviewersController
);

coordinatorResearchRoute.patch(
  "/coordinator-researches-list/:id/defense-date",
  assignDefenseDateController
);
coordinatorResearchRoute.patch("/coordinator-researches-list/:id/decision", makeFinalDecision);

export default coordinatorResearchRoute;
