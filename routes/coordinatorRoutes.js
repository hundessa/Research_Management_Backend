import express from 'express';
import { coordinatorUserRetrivalController, coordinatorResearchRetrivalController, getCoordinatorSingleResearchController, assignReviewersController, assignDefenseDateController, makeFinalDecision, getCoordinatorNotifications, sendCoordinatorNotification } from '../controllers/coordinatorControllers.js';

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