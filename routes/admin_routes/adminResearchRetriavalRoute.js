import express from "express";
import adminResearchesRetrievingController from "../../controllers/admin_controller/adminResearchesRetrievingController.js";

const adminResearchRetrievalRoute = express.Router();

adminResearchRetrievalRoute.get('/admin-research-list', adminResearchesRetrievingController);

export default adminResearchRetrievalRoute;