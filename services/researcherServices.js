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
  console.log("SERVICE RECEIVED:", {
    researcherId,
    researchTitle,
    researchType,
    hasFile: !!researchFile,
    fileName: researchFile?.originalname
  });

  // Strong validation
  if (!researcherId || !researchTitle || !researchType || !researchFile) {
    throw new AppError("All fields are required", 400);
  }

  if (researchFile.mimetype !== "application/pdf") {
    throw new AppError("Research file must be a PDF", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let filePath = null;
  let createdResearch = null;

  try {
    // 1. Upload file
    const { fileUrl, filePath: uploadedPath } = await uploadFileService(researchFile);
    filePath = uploadedPath;

    // 2. Create research - FIXED: Pass array when using session
    const researchData = [{
      researcher: researcherId,
      researchTitle: researchTitle.trim(),
      researchType: researchType.trim(),
      researchFile: fileUrl,
      status: "submitted",
    }];

    createdResearch = await researchModel.create(researchData, { session });
    createdResearch = createdResearch[0];   // because we passed array

    // 3. Find admin
    const admin = await userModel
      .findOne({ role: "admin" })
      .select("_id")
      .session(session);

    if (!admin) {
      throw new AppError("No admin found to notify", 404);
    }

    // 4. Create notification
    await notificationModel.create([{
      recipient: admin._id,
      recipientRole: "admin",
      message: `New research "${researchTitle}" submitted`,
      researchId: createdResearch._id,
    }], { session });

    // 5. Create event
    await createEvent({
      actor: researcherId,
      action: "RESEARCH_SUBMITTED",
      target: createdResearch._id,
      metadata: { researchTitle },
    }, session);

    // 6. Commit
    await session.commitTransaction();

    // 7. Send external notification after commit
    await sendNotification({
      recipient: admin._id,
      recipientRole: "admin",
      message: `New research "${researchTitle}" has been submitted.`,
      researchId: createdResearch._id,
    });

    return createdResearch;

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Cleanup
    if (createdResearch?._id) {
      await researchModel.findByIdAndDelete(createdResearch._id).catch(() => {});
    }
    if (filePath) {
      await deleteFileService(filePath).catch(() => {});
    }

    throw error;
  } finally {
    session.endSession();
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
    researchModel.countDocuments({ researcher: researcherId }),
    researchModel
      .find({ researcher: researcherId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("researcher", "firstname lastname email"),
  ]);

  // if (researches.length === 0) {
  //   throw new AppError("No researches found for this researcher", 404);
  // }
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
    .populate("researcher", "firstname lastname email");
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
  if (
    !researchId ||
    !researcherId ||
    amount === undefined ||
    !purpose ||
    !parsedBankDetails
  ) {
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
  if (
    !parsedBankDetails.accountName ||
    !parsedBankDetails.accountNumber ||
    !parsedBankDetails.bankName
  ) {
    throw new AppError("Invalid bank details provided", 400);
  }
  if (error.code === 11000) {
    throw new AppError("Finance release already exists", 400);
  }

  const financeRelease = await FinanceRelease.create({
    researchId,
    researcherId,
    amount,
    purpose,
    bankDetails: parsedBankDetails,
  });

  const directorate = await userModel
    .findOne({ role: "directorate" })
    .select("_id");
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

export const getAllResearcherFinanceReleasesService = async (researcherId) => {
  // if (!researchId) {
  //   throw new AppError("Research ID is required", 400);
  // }
  if (!mongoose.Types.ObjectId.isValid(researcherId)) {
    throw new AppError("Invalid researcher ID", 400);
  }

  const financeReleases = await FinanceRelease.find({ researcherId })
    .populate("researcherId", "firstname lastname email")
    .sort({ submittedAt: -1 });

  return financeReleases;
};

export const getResearcherFinanceReleasesService = async (researchId) => {
  if (!researchId) {
    throw new AppError("Research ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(researchId)) {
    throw new AppError("Invalid research ID", 400);
  }

  const financeReleases = await FinanceRelease.find({ researchId })
    .populate("researchId", "researchTitle status")
    .sort({ submittedAt: -1 });

  return financeReleases;
};

export const submitProgressReportService = async (
  researchId,
  researcherId,
  amountSpent,
  report,
  attachments = [],
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
  attachments.forEach((file) => {
    if (file.mimetype !== "application/pdf") {
      throw new AppError("Attachments must be PDF files", 400);
    }
  });

  const uploadedAttachements = await uploadFileService(attachments);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const progressReport = await progressReportModel.create(
      {
        researchId,
        researcherId,
        amountSpent: Number(amountSpent),
        report,
        attachments,
      },
      { session },
    );

    const financeHead = await userModel
      .findOne({ role: "finance" })
      .select("_id")
      .session(session);
    if (!financeHead) {
      throw new AppError("No finance head found to notify", 404);
    }

    await notificationModel.create(
      {
        recipient: financeHead._id,
        recipientRole: "finance",
        message: `A new progress report has been submitted for research ${researchId} by researcher ${researcherId}.`,
        researchId,
        progressReportId: progressReport._id,
      },
      { session },
    );

    await createEvent(
      {
        actor: researcherId,
        action: "PROGRESS_REPORT_SUBMITTED",
        target: researchId,
        metadata: { reportId: progressReport._id },
      },
      session,
    );

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
  }
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
    .populate("researchId", "researchTitle status")
    .populate("financeId", "amount purpose");

  return reports;
};

// export const getResearcherNotificationsService = async (researcherId) => {
//   if (!researcherId) {
//     throw new AppError("Researcher ID is required", 400);
//   }
//   if (!mongoose.Types.ObjectId.isValid(researcherId)) {
//     throw new AppError("Invalid researcher ID", 400);
//   }

//   const notifications = await notificationModel
//     .find({ recipient: researcherId, recipientRole: "researcher" })
//     .sort({ createdAt: -1 })
//     .limit(50);

//   return notifications;
// };
