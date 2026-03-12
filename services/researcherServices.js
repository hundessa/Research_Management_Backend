import mongoose from "mongoose";
import researchModel from "../models/researchModel.js";
import userModel from "../models/userModel.js";
import { createEvent } from "./eventLogService.js";
import { sendNotification } from "./notificationService.js";
import AppError from "../utils/AppError.js";
import notificationModel from "../models/notificationModel.js";
import FinanceRelease from "../models/financeReleaseModel.js";
import { deleteFileService, uploadFileService } from "./fileUploadService.js";
import progressReportModel from "../models/progressReportModel.js";

export const submitResearchService = async (
  researcherId,
  researchTitle,
  researchType,
  researchFile,
) => {
  if (!researchTitle || !researchType || !researchFile) {
    throw new AppError("All fields are required", 400);
  }
  if (typeof researchTitle !== "string" || typeof researchType !== "string") {
    throw new AppError("Research title and type must be strings", 400);
  }
  if (!researchFile) {
    throw new AppError("Research file is required", 400);
  }
  if (researchFile.mimetype !== "application/pdf") {
    throw new AppError("Research file must be a PDF", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researcherId)) {
    throw new AppError("Invalid researcher ID", 400);
  }

  const uploadedFileData = await uploadFileService(researchFile);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [ research ] = await researchModel.create(
     [ {
        researchTitle,
        researchType,
        uploadedFile: uploadedFileData.fileUrl,
        status: "submitted",
        researcherId,
      }],
      { session },
    );

    const admin = await userModel.findOne({ role: "admin" }).select("_id").session(session);
    if (!admin) {
      throw new AppError("No admin found to notify", 404);
    }

    await notificationModel.create(
      [{
        recipient: admin._id,
        recipientRole: "admin",
        message: `New research "${researchTitle}" submitted`,
        researchId: research._id
      }],
      { session }
    );

    await createEvent({
      actor: researcherId,
      action: "RESEARCH_SUBMITTED",
      target: research._id,
      metadata: { researchTitle },
    }, session);

     await session.commitTransaction();
    session.endSession();

    await sendNotification({
      recipient: admin._id,
      recipientRole: "admin",
      message: `New research "${researchTitle}" has been submitted by a researcher ${researcherId}.`,
      researchId: research._id,
    });

    return research;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (uploadedFileData?.filePath) {
      await deleteFileService(uploadedFileData.filePath);
    }

    throw error;
  }
};

export const researcherResearchListService = async (
  researcherId,
  page = 1,
  limit = 10,
  sort = "-createdAt",
) => {
  if (!researcherId) {
    throw new AppError("Researcher ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researcherId)) {
    throw new AppError("Invalid researcher ID", 400);
  }

  const skip = (page - 1) * limit;

  const [total, researches] = await Promise.all([
    researchModel.countDocuments({ researcherId }),
    researchModel
      .find({ researcherId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("researcherId", "firstname lastname email"),
  ]);

  if (researches.length === 0) {
    throw new AppError("No researches found for this researcher", 404 );
  }
  if (!researches) throw new AppError("Failed to retrieve researches", 500);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: researches,
  };
};

export const getSingleResearchService = async (researchId) => {
  if (!researchId) throw new AppError("Research ID is required", 400);
    if (!mongoose.Types.ObjectId.isValid(researchId)) {
      throw new AppError("Invalid research ID", 400);
    }
  const research = await researchModel
    .findById(researchId)
    .populate("researcherId", "firstname lastname email");
  if (!research) {
    throw new AppError("Research not found", 404);
  }
  return research;
};

export const submitFinanceService = async (
  researchId,
  researcherId,
  amount,
  purpose,
  bankDetails,
) => {
  let parsedBankDetails = bankDetails;
  if (typeof bankDetails === "string") {
    try {
      parsedBankDetails = JSON.parse(bankDetails);
    } catch (error) {
      throw new AppError("Invalid bank details format", 400);
    }
  }
  if (!researchId || !researcherId || amount === undefined || !purpose || !parsedBankDetails) {
    throw new AppError("All fields are required", 400);
  }
  if (
    !mongoose.Types.ObjectId.isValid(researchId) ||
    !mongoose.Types.ObjectId.isValid(researcherId)
  ) {
    throw new AppError("Invalid research or researcher ID", 400);
  }
  if (typeof amount !== "number" || amount < 0) {
    throw new AppError("Amount must be a non-negative number", 400);
  }
  if (!parsedBankDetails.accountName || !parsedBankDetails.accountNumber || !parsedBankDetails.bankName) {
    throw new AppError("Invalid bank details provided", 400);
  }

  const financeRelease = await FinanceRelease.create({
    researchId,
    researcherId,
    amount,
    purpose,
    bankDetails: parsedBankDetails,
  });

  const directorate = await userModel.findOne({ role: "directorate" }).select("_id");
  if (directorate) {
    await sendNotification({
      recipient: directorate._id,
      recipientRole: "directorate",
      message: `A new finance release has been submitted for research ${researchId} by researcher ${researcherId}.`,
      researchId,
    });
  }

  return financeRelease;
};

export const getResearcherFinanceReleasesService = async (researchId) => {
  if (!researchId) {
    throw new AppError("Research ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researchId)) {
    throw new AppError("Invalid research ID", 400);
  }

  const financeReleases = await FinanceRelease.find({ researchId }).populate("researchId", "researchTitle status").sort({ submittedAt: -1 });

  return financeReleases;
};

export const submitProgressReportService = async (
  researchId,
  researcherId,
  amountSpent,
  report,
  attachments = []
) => {
  if (!researchId || !researcherId || amountSpent === undefined || !report) {
    throw new AppError("All fields are required", 400);
  }
  if (
    !mongoose.Types.ObjectId.isValid(researchId) ||
    !mongoose.Types.ObjectId.isValid(researcherId)
  ) {
    throw new AppError("Invalid research or researcher ID", 400);
  }
  if (typeof amountSpent !== "number" || amountSpent < 0) {
    throw new AppError("Amount spent must be a non-negative number", 400);
  }
  attachments.forEach(file => {
  if (file.mimetype !== "application/pdf") {
    throw new AppError("Attachments must be PDF files", 400);
  }
});

  const uploadedAttachements = await uploadFileService(attachments);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

  const progressReport = await progressReportModel.create({
    researchId,
    researcherId,
    amountSpent: Number(amountSpent),
    report,
    attachments,
  }, { session });

  const financeHead = await userModel.findOne({ role: "finance" }).select("_id").session(session);
  if(!financeHead) {
    throw new AppError("No finance head found to notify", 404);
  }

  await notificationModel.create({
    recipient: financeHead._id,
    recipientRole: "finance",
    message: `A new progress report has been submitted for research ${researchId} by researcher ${researcherId}.`,
    researchId,
    progressReportId: progressReport._id,
  }, { session });

  await createEvent({
    actor: researcherId,
    action: "PROGRESS_REPORT_SUBMITTED",
    target: researchId,
    metadata: { reportId: progressReport._id },
  }, session);

   await session.commitTransaction();
   session.endSession();

   await sendNotification({
    recipient: financeHead._id,
    recipientRole: "finance",
    message: `A new progress report has been submitted for research ${researchId} by researcher ${researcherId}.`,
    researchId,
    progressReportId: progressReport._id,
  });

   return progressReport;

} catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (uploadedAttachements?.filePath) {
      await deleteFileService(uploadedAttachements.filePath);
    }

  throw error;
};
};

export const getProgressReportsService = async (researcherId) => {
  if (!researcherId) {
    throw new AppError("Researcher ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researcherId)) {
    throw new AppError("Invalid researcher ID", 400);
  }

  const reports = await progressReportModel
    .find({ researcherId })
    .sort({ createdAt: -1 })
    .populate("researchId", "researchTitle status").populate("financeId", "amount purpose");

  return reports;
}

export const getResearcherNotificationsService = async (researcherId) => {
  if (!researcherId) {
    throw new AppError("Researcher ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researcherId)) {
    throw new AppError("Invalid researcher ID", 400); 
  }

  const notifications = await notificationModel
    .find({ recipient: researcherId, recipientRole: "researcher" })
    .sort({ createdAt: -1 })
    .limit(50);

  return notifications;
};
