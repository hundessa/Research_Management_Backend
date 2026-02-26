import express from 'express';
import { researchController, researcherResearchList, getSingleResearch, getResearcherNotifications, createNotification, submitFinanceRequest, getResearcherFinanceReleases, submitProgressReport, getProgressReports } from '../controllers/researcherControllers.js';

const researcherRoutes = express.Router();

researcherRoutes.post('/research-upload', researchController);
researcherRoutes.get("/researches", researcherResearchList);
researcherRoutes.get("/researches/:id", getSingleResearch);
researcherRoutes.get("/notifications", getResearcherNotifications);
researcherRoutes.post("/notifications", createNotification);
researcherRoutes.post("/finance-request-submit", submitFinanceRequest);
researcherRoutes.get("/finance-requests", getResearcherFinanceReleases);
researcherRoutes.post("/progress-reports", submitProgressReport);
researcherRoutes.get("/progress-reports", getProgressReports);

export default researcherRoutes;