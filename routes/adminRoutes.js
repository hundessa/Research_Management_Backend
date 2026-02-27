import express from 'express';
import { adminUserRetrievalController, adminResearchesRetrievingController, getResearchById, adminResearchStatusUpdateController, getAdminNotifications, sendAdminNotification } from '../controllers/adminControllers.js';

const adminRoutes = express.Router();

adminRoutes.get('/users', adminUserRetrievalController);
adminRoutes.get('/notifications', getAdminNotifications);
adminRoutes.post('/notifications', sendAdminNotification);
adminRoutes.get('/researches', adminResearchesRetrievingController);
adminRoutes.get('/researches/:id', getResearchById);
adminRoutes.patch('/update-research-status/:id', adminResearchStatusUpdateController);

export default adminRoutes;