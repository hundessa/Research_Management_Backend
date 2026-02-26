import express from "express";
import { getSingleResearchController, reviewerResearchListController, submitEvaluationController } from "../controllers/reviewerControllers.js";

const reviewerRoutes = express.Router();

reviewerRoutes.get("/researches/:reviewerId", reviewerResearchListController);
reviewerRoutes.get("/research/:id", getSingleResearchController);
reviewerRoutes.put("/research/:id/evaluation", submitEvaluationController);

export default reviewerRoutes;