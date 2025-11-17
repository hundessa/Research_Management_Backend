// financeRouter.js
import express from "express";
import {getProgressReports,
  submitProgressReport,
  getResearcherFinanceReleases,
  submitFinanceRequest,
} from "../../controllers/researcher_controller/financeReleaseController.js";

const financeRouter = express.Router();

financeRouter.post("/researcher/finance-submit", submitFinanceRequest);
financeRouter.get("/researcher/finance-requests", getResearcherFinanceReleases);
financeRouter.post("/progress-reports", submitProgressReport);
financeRouter.get("/progress-reports", getProgressReports);

export default financeRouter;
