import express from "express"
import adminStatusUpdateController from "../../controllers/admin_controller/adminStatusUpdateController.js";

const adminStatusUpdateRoute = express.Router();

adminStatusUpdateRoute.patch("/admin/researches-list/:id", adminStatusUpdateController);

export default adminStatusUpdateRoute;  