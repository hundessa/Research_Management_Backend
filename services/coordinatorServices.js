import mongoose from "mongoose";
import researchModel from "../models/researchModel.js";
import userModel from "../models/userModel.js";
import { sendNotification } from "./notificationService.js";

export const coordinatorGetAllUsersService = async () => {
  const users = await userModel.find({ role: "reviewer" });
  return users;
};

export const coordinatorGetAllResearchesService = async () => {
  const researches = await researchModel.find({
    $or: [
      { status: "accepted" },
      { status: "under_review" },
      { status: "reviewed" },
      { status: "defence_scheduled" },
      { status: "defended" },
      { status: "finalized" },
    ],
  });
  return researches;
};

export const coordinatorGetOneResearchService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid research ID");
  }

  const research = await researchModel
    .findById(id)
    .populate("researcher.id", "firstname lastname email")
    .populate("preDefenseEvaluations.reviewer", "firstname lastname email")
    .populate("postDefenseEvaluations.reviewer", "firstname lastname email");
  if (!research) {
    throw new AppError("No Research Found", 400);
  }
  return research;
};

export const coordinatorAssignReviewersService = async (id, reviewers, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid research ID");
  }

  const busyReviewers = await researchModel.findOne({
  reviewers: { $in: reviewers },
  status: { $in: ["under_review", "defence_scheduled"] }
});

if (busyReviewers) {
  throw new AppError("One or more reviewers are already assigned to another research", 400);
}

  const research = await researchModel.findById(id);
  if (!research) {
    throw new AppError("Research not found", 404);
  }
  if (
    !Array.isArray(reviewers) ||
    reviewers.length !== 3 ||
    !reviewers.every((id) => mongoose.Types.ObjectId.isValid(id))
  ) {
    throw new AppError("Exactly 3 reviewers must be assigned", 400);
  }
  if (status !== "accepted") {
    throw new AppError("Reviewers are only assigned to accepted research", 400);
  }
  if (research.preDefenseEvaluations.length > 0) {
  throw new AppError(
    "Reviewers cannot be changed after evaluations begin",
    400
  );
}
const uniqueReviewers = new Set(reviewers);

if (uniqueReviewers.size !== reviewers.length) {
  throw new AppError("Duplicate reviewers are not allowed");
}

  research.reviewers = reviewers;
  research.status = "under_review";
  await research.save();

for (const reviewerId of reviewers) {
  await sendNotification({
    recipient: reviewerId,
    recipientRole: "reviewer",
    message: `You have been assigned to review the research titled "${research.researchTitle}".`,
  });
}

  return research;
};

export const assignDefenseDateService = async (id, defenseDate) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid research ID");
        }
        if (!defenseDate || isNaN(new Date(defenseDate).getTime())) {
        throw new AppError("Invalid defense date", 400);
        }

        const research = await researchModel.findById(id);
        if (!research) {
        throw new AppError("Research not found", 404);
        }
          if (research.preDefenseEvaluations.length !== 3) {
        throw new AppError("All pre-defense evaluations must be completed", 400);
        }

        research.defenseDate = new Date(defenseDate);
        research.status = "defence_scheduled";
        await research.save();

        return research;
}

export const makeFinalDecisionService = async (id, decision) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid research ID");
  }
  const research = await researchModel.findById(id);
  if (!research) {
    throw new AppError("Research not found", 404);
  }
  if (decision !== "accepted" && decision !== "rejected") {
    throw new AppError("Decision must be either 'accepted' or 'rejected'", 400);
  }
  research.status = decision === "accepted" ? "finalized" : "rejected";
  await research.save();

  return research;
};

export const coordinatorGetNotificationsService = async (coordinatorId) => {
  const notifications = await Notification.find({ recipient: coordinatorId }).sort({ createdAt: -1 });
  return notifications;
}