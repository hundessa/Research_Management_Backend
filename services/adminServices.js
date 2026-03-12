import userModel from "../models/userModel.js";
import researchModel from "../models/researchModel.js";
import Notification from "../models/notificationModel.js";
import { sendNotification } from "./notificationService.js";
import { createEvent } from "./eventLogService.js";

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

export const adminUpdateResearchStatusService = async (id, status, actorId) => {

  //if there are more than 1 coordinators, we can send notification to the one we choose, for now there is only one coordinator
  const coordinator = await userModel.findOne({ role: "coordinator" });
  if (!coordinator) {
    throw new AppError("No coordinator found to notify", 404);
  }

  const research = await researchModel.findById(id);
  if(!research) {
    throw new AppError("No Research Found", 400)
  }
const prevStatus = research.status;

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const updatedResearch = await researchModel.findByIdAndUpdate(
    // to prevent updating the status of a research that is already accepted or rejected, we can add a condition to check if the current status is pending or underreview before allowing the update
    // { _id: id, status: "pending" },
    id,
    { status },
    { new: true },
  );

  if (!updatedResearch) {
    throw new AppError("Research already processed or not found", 404);
  }

  // Send notification to coordinator if status is accepted
  if (status === "accepted") {
    await sendNotification({
      message: `Research titled "${updatedResearch.researchTitle}" has been accepted.`,
      recipient: coordinator._id,
      recipientRole: "coordinator",
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
    actor: actorId,
    action: "STATUS_UPDATED",
    target: research._id,
    previousState: prevStatus,
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
