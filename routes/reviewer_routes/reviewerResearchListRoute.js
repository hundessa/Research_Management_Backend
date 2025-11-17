import express from "express";
import { getSingleResearchController, reviewerResearchListController, submitEvaluationController } from "../../controllers/reviewer_controller/reviewerResearchListController.js";

const reviewerResearchListRoute = express.Router();

reviewerResearchListRoute.get("/reviewer-researches/:reviewerId", reviewerResearchListController);
reviewerResearchListRoute.get(
  "/reviewer-research/:id",
  getSingleResearchController
);
reviewerResearchListRoute.put(
  "/reviewer-research/:id/evaluation",
  submitEvaluationController
);

export {reviewerResearchListRoute}