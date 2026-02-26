import express from "express";
import { getSingleResearchController, reviewerResearchListController, submitEvaluationController } from "../controllers/reviewer_controller/reviewerResearchListController";

const reviewerRoutes = express.Router();

reviewerRoutes.get("/researches/:reviewerId", reviewerResearchListController);
reviewerRoutes.get("/research/:id", getSingleResearchController);
reviewerRoutes.put("/research/:id/evaluation", submitEvaluationController);

export default reviewerRoutes;