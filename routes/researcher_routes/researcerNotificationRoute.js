import express from "express";
import {createNotification, getResearcherNotifications} from "../../controllers/researcher_controller/researcherNotificationController.js";


const resercherNotificationRoute = express.Router();

resercherNotificationRoute.get(
  "/researcher-notifications",
  getResearcherNotifications
);
resercherNotificationRoute.post(
  "/researcher-notifications",
createNotification);

export default resercherNotificationRoute;
