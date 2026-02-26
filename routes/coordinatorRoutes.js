import express from 'express';
import { coordinatorUserRetrivalController, coordinatorResearchRetrivalController, getCoordinatorSingleResearchController, assignReviewersController, assignDefenseDateController, makeFinalDecision } from '../controllers/coordinatorControllers.js';
import { getCoordinatorNotifications, sendCoordinatorNotification } from '../controllers/coordinatorNotificationController.js';

const coordinatorRoutes = express.Router();

coordinatorRoutes.get('/users', coordinatorUserRetrivalController);
coordinatorRoutes.get('/researches', coordinatorResearchRetrivalController);
coordinatorRoutes.get('/researches/:id', getCoordinatorSingleResearchController);
coordinatorRoutes.patch('/researches/:id', assignReviewersController);
coordinatorRoutes.patch('/researches/:id/defense-date', assignDefenseDateController);
coordinatorRoutes.patch('/researches/:id/decision', makeFinalDecision);
coordinatorRoutes.get('/notifications', getCoordinatorNotifications);
coordinatorRoutes.post('/notifications', sendCoordinatorNotification);

export default coordinatorRoutes;