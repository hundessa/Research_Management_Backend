import userModel from "../models/userModel";
import researchModel from "../models/researchModel";
import Notification from "../models/notificationModel.js";
import { sendNotification } from "./notificationService.js";

export const adminGetAllUsersService = async () => {
  const Users = await userModel.find();
  const UserDetail = Users.map((user) => ({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    status: user.status,
  }));

  return UserDetail;
};

export const adminGetAllResearchesService = async () => {
  const researches = await researchModel
    .find()
    .populate("researcher", "firstname email");
  const researchesDetails = researches.map((research) => ({
    researchTitle: research.researchTitle,
    researchType: research.researchType,
    researchFile: research.researchFile,
    status: research.status,
    date: research.createdAt,
    researcherName: research.researcher?.firstname || "Unknown",
    researcherEmail: research.researcher?.email || "Unknown",
  }));

  return researchesDetails;
};

export const adminGetOneResearchService = async (id) => {
  const research = await researchModel.findById(id);
  if (!research) {
    throw new AppError("Research not found", 404);
  }
  return research;
};

export const adminUpdateResearchStatusService = async (id, status) => {
  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const updatedResearch = await researchModel.findByIdAndUpdate(
    { _id: id, status: "pending" },
    { status },
    { new: true },
  );

  if (!updatedResearch) {
    throw new AppError("Research already processed not found", 404);
  }

  // Send notification to dean if status is accepted
  if (status === "accepted") {
    await sendNotification({
      message: `Research titled "${updatedResearch.researchTitle}" has been accepted.`,
      recipientRole: "dean",
      researchId: id,
    });
  }

    // Notify Researcher in all status changes
  await sendNotification({
    message: `Your research "${updatedResearch.researchTitle}" status is now "${status}"`,
    to: updatedResearch.researcher, // user ID
    recipientRole: "researcher",
    researchId: id,
  });

  // 1️Create event log
  await createEvent({
    actor,                     // req.user._id
    action: "STATUS_UPDATED",
    target: research._id,
    previousState: previousStatus,
    newState: status,
    metadata: { researchTitle: research.researchTitle },
  });

  return updatedResearch;
};

export const getAdminNotificationsService = async () => {
  const notifications = await Notification.find({
    recipientRole: "admin",
  }).sort({ timestamp: -1 });
  return notifications;
};
