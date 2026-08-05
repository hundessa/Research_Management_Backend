import { financeRequestProcessedService, getFinanceNotificationsService, getFinanceReportService, getFinanceRequestsService } from "../services/financeServices.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getFinanceRequests = asyncHandler(async (req, res) => {

  const requests = await getFinanceRequestsService();

  res.status(200).json({
    success: true,
    data: requests,
  });
});

export const financeRequestProcessed = asyncHandler(async (req, res) => {
  const { researchId } = req.params;

  const report = await financeRequestProcessedService(researchId);

  res.status(200).json({
    success: true,
    data: report,
  });
});

export const getFinanceReport = asyncHandler(async (req, res) => {
  const { researchId } = req.params;

  const report = await getFinanceReportService(researchId);

  res.status(200).json({
    success: true,
    data: report,
  });
});


export const getFinanceNotifications = asyncHandler(async (req, res) => {

  const financeId = req.user.id; 

  const notifications = await getFinanceNotificationsService(financeId);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});