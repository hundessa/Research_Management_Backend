import express from 'express';
import coordinatorUserRetrivalController from '../controllers/coordinator_controller/coordinatorUserRetrivalController';
import { assignDefenseDateController, assignReviewersController, coordinatorResearchRetrivalController, getCoordinatorSingleResearchController, makeFinalDecision } from '../controllers/coordinator_controller/coordinatorResearchRetrievalController';
import { getCoordinatorNotifications, sendCoordinatorNotification } from '../controllers/coordinator_controller/coordinatorNotificationController';

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