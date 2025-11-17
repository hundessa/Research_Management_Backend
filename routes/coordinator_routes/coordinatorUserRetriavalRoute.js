import express from "express";
import coordinatorUserRetrivalController from "../../controllers/coordinator_controller/coordinatorUserRetrivalController.js";

const coordinatorUserRetrivalRoute = express.Router();

coordinatorUserRetrivalRoute.get("/coordinator-users-list", coordinatorUserRetrivalController);

export default coordinatorUserRetrivalRoute;