import express from "express";
import {
  researchController,
  researcherResearchList,
  getSingleResearch,
  submitFinanceRequest,
  getResearcherFinanceReleases,
  submitProgressReport,
  getProgressReports,
  getAllResearcherFinanceReleases,
} from "../controllers/researcherControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const researcherRoutes = express.Router();

researcherRoutes.post("/research-upload", upload.single("researchFile"), researchController);
researcherRoutes.get("/researches", researcherResearchList);
researcherRoutes.get("/researches/:id", getSingleResearch);
researcherRoutes.post("/finance-request-submit", submitFinanceRequest);
researcherRoutes.get("/finance-requests", getAllResearcherFinanceReleases);
researcherRoutes.get("/finance-requests/:researchId", getResearcherFinanceReleases);
researcherRoutes.post("/progress-reports", upload.array("attachments", 5), submitProgressReport);
researcherRoutes.get("/progress-reports", getProgressReports);

export default researcherRoutes;
