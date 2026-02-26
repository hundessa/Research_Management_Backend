import express from 'express';
import adminUserRetrievalController from '../controllers/admin_controller/adminUserRetrievalController';
import adminResearchesRetrievingController from '../controllers/admin_controller/adminResearchesRetrievingController';
import adminStatusUpdateController from '../controllers/admin_controller/adminStatusUpdateController';
import { getAdminNotifications, sendAdminNotification } from '../controllers/admin_controller/adminNotificationController';
import { getResearchById } from '../controllers/admin_controller/getResearchById';

const adminRoutes = express.Router();

adminRoutes.get('/users', adminUserRetrievalController);
adminRoutes.get('/notifications', getAdminNotifications);
adminRoutes.post('/notifications', sendAdminNotification);
adminRoutes.get('/researches', adminResearchesRetrievingController);
adminRoutes.get('/researches/:id', getResearchById);
adminRoutes.patch('/update-research-status/:id', adminStatusUpdateController);

export default adminRoutes;