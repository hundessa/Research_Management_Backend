import mongoose from "mongoose";
import FinanceRelease from "../models/financeReleaseModel.js";
import notificationModel from "../models/notificationModel.js";
import { sendNotification } from "./notificationService.js";
import { createEvent } from "./eventLogService.js";


export const getFinanceRequestsService = async () => {

    const requests = await FinanceRelease.find({ status: "approved" }).populate("researcherId", "name email").populate("researchId", "researchTitle");

    return requests;
  }

  export const getFinanceReportService = async (researchId) => {
  if (!researchId) throw new AppError("Research ID is required", 400);
  if (!mongoose.Types.ObjectId.isValid(researchId)) {
    throw new AppError("Invalid research ID", 400);
  }

  const report = await FinanceRelease.findOne({ researchId }).populate("researchId", "researchTitle status").populate("researcherId", "firstname lastname email");

  if (!report) {
    throw new AppError("No finance report found for this research", 404);
  }

  return report;
};

export const financeRequestProcessedService = async(researchId) => {
  if (!researchId) throw new AppError("Research ID is required", 400);
  if (!mongoose.Types.ObjectId.isValid(researchId)) {
    throw new AppError("Invalid research ID", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try{
  const report = await FinanceRelease.findOneAndUpdate(
  { researchId, status: "approved" }, // condition
  {
    status: "processed",
    processedAt: new Date(),
  },
  { new: true, session }
).populate("researchId", "researchTitle status").populate("researcherId", "firstname lastname email");

 if (!report) {
      throw new AppError("Finance request already processed or not approved", 400);
    }
  // report.status = "released";
  // await report.save({ session});

  await sendNotification({
    recipient: report.researcherId._id,
    recipientRole: "researcher",
    message: `Your finance release for research "${report.researchId.researchTitle}" has been sent`,
    researchId: report.researchId._id,
    type: "finance_release",
    title: "Finance Release Sent",
  }, {session});

  await createEvent({
    userId: report.researcherId._id,
    action: "finance_release_sent",
    details: `Finance release for research "${report.researchId.researchTitle}" has been sent`,
    researchId: report.researchId._id,
  }, {session});

  await session.commitTransaction();

  return report;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export const getFinanceNotificationsService = async (financeId) => {

  const notification = await notificationModel.find({ recipient: financeId, recipientRole: "finance" }).sort({ createdAt: -1 });

  return notification;
}