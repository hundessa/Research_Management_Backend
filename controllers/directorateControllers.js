import { approveFinanceRequestService, getDirectorateNotificationService, getFinanceRequestsService, rejectFinanceRequestService } from "../services/directorateServices.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getFinanceRequests = asyncHandler(async (req, res) => {

    const financeRequests = await getFinanceRequestsService();

    res.status(200).json({
      success: true,
      data: financeRequests,
    });
});


export const approveFinanceRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const directorateId = req.user._id; 

    const request = await approveFinanceRequestService(requestId, directorateId);

    res.status(200).json({
      success: true,
      message: "Finance request approved successfully",
      data: request,
    });
});

export const rejectFinanceRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const directorateId = req.user._id; 

    const request = await rejectFinanceRequestService(requestId, directorateId);

    res.status(200).json({
      success: true,
      message: "Finance request rejected successfully",
      data: request,
    });
});

export const getDirectorateNotifications = asyncHandler( async (req, res) => {
    const directorateId = req.user._id;

    const notifications = await getDirectorateNotificationService(directorateId);

    res.status(200).json({
      success: true,
      data: notifications,
    });
});

