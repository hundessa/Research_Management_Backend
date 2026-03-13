import mongoose from "mongoose";
import FinanceRequest from "../models/financeReleaseModel.js";
import { createEvent } from "./eventLogService.js";
import { sendNotification } from "./notificationService.js";
import AppError from "../utils/AppError.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

export const getFinanceRequestsService = async () => {
  const financeRequests = await FinanceRequest.find()
    .populate("researchId", "researchTitle")
    .populate("researcherId", "name email");

  if ( financeRequests.length === 0 ) {
    throw new AppError("No finance requests found", 404);
  }

  return financeRequests;
};

export const approveFinanceRequestService = async (requestId, directorateId) => {
  if (!requestId) throw new AppError("Request ID is required", 400);
  if (!mongoose.Types.ObjectId.isValid(requestId))
    throw new AppError("Invalid request ID", 400);

  const request = await FinanceRequest.findById(requestId)
    .populate("researcherId", "name email")
    .populate("researchId", "researchTitle");

  if (!request) throw new AppError("Finance request not found", 404);
  const prevStatus = request.status;

  if (prevStatus !== "pending")
    throw new AppError("Request already processed", 400);

  request.status = "approved";
  request.processedAt = new Date();
  await request.save();

  const finance = await userModel.findOne({ role: "finance" }).select("_id");

  if (!finance) throw new AppError("No finance user found to notify", 404);

  await Promise.allSettled([
   sendNotification({
    recipient: finance._id,
    recipientRole: "finance",
    message: `New approved finance request from ${request.researcherId.name} for research: ${request.researchId.researchTitle}`,
    researchId: request.researchId._id,
    type: "finance_request",
    title: "Finance Request Approval",
  }),
   sendNotification({
    recipient: request.researcherId._id,
    recipientRole: "researcher",
    message: `Your finance request for research "${request.researchId.researchTitle}" has been approved`,
    researchId: request.researchId._id,
    type: "finance_request",
    title: "Finance Request Approved",
  })
  ]);

  await createEvent({
    actor: directorateId,
    action: "FINANCE_REQUEST_APPROVED",
    target: request._id,
    metadata: { researchId: request.researchId._id },
    // details: `Finance request for research ${request.researchId} approved by directorate`,
  });

  return request;
};

export const rejectFinanceRequestService = async (requestId, directorateId) => {
  if (!requestId) throw new AppError("Request ID is required", 400);
  if (!mongoose.Types.ObjectId.isValid(requestId))
    throw new AppError("Invalid request ID", 400);

  const request = await FinanceRequest.findById(requestId)
    .populate("researcherId", "name email")
    .populate("researchId", "researchTitle");

  if (!request) throw new AppError("Finance request not found", 404);
  const prevStatus = request.status;

  if (prevStatus !== "pending") throw new AppError("Invalid status value", 400);

  request.status = "rejected";
  request.processedAt = new Date();
  await request.save();

  await sendNotification({
    recipient: request.researcherId._id,
    recipientRole: "researcher",
    message: `Your finance request for research "${request.researchId.researchTitle}" has been rejected`,
    researchId: request.researchId._id,
    type: "finance_request",
    title: "Finance Request Rejected",
  });

  await createEvent({
    actor: directorateId,
    action: "FINANCE_REQUEST_REJECTED",
    target: request._id,
    metadata: { researchId: request.researchId._id },
    // details: `Finance request for research ${request.researchId} rejected by directorate`,
  });

  return request;
};

export const getDirectorateNotificationService = async (directorateId) => {
  if (!directorateId) {
    throw new AppError("Directorate ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(directorateId)) {
    throw new AppError("Invalid directorate ID", 400);
  }

  const notifications = await notificationModel
    .find({
      recipient: directorateId,
      recipientRole: "directorate",
    })
    .sort({ timestamp: -1 })
    .limit(50);

  return notifications;
};
