import express from "express";
import adminUserRetrievalController from "../../controllers/admin_controller/adminUserRetrievalController.js";


const adminUserRetrievalRoute = express.Router();

adminUserRetrievalRoute.get("/admin-users-list", adminUserRetrievalController);

export default adminUserRetrievalRoute;