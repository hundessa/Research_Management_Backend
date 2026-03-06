import express from 'express';
import { coordinatorGetAllUsersController, coordinatorResearchRetrivalController, getCoordinatorSingleResearchController, assignReviewersController, assignDefenseDateController, makeFinalDecision, getCoordinatorNotifications, sendCoordinatorNotification } from '../controllers/coordinatorControllers.js';

const coordinatorRoutes = express.Router();

coordinatorRoutes.get('/users', coordinatorGetAllUsersController);
coordinatorRoutes.get('/researches', coordinatorResearchRetrivalController);
coordinatorRoutes.get('/researches/:id', getCoordinatorSingleResearchController);
coordinatorRoutes.patch('/researches/:id', assignReviewersController);
coordinatorRoutes.patch('/researches/:id/defense-date', assignDefenseDateController);
coordinatorRoutes.patch('/researches/:id/decision', makeFinalDecision);
coordinatorRoutes.get('/notifications', getCoordinatorNotifications);

export default coordinatorRoutes;