import mongoose from "mongoose";
import researchModel from "../models/researchModel.js";
import AppError from "../utils/AppError.js";
import { createEvent } from "./eventLogService.js";
import { sendNotification } from "./notificationService.js";
import userModel from "../models/userModel.js";

export const reviewerSubmitEvaluationService = async (
  researchId,
  reviewerId,
  evaluationPhase,
  score,
) => {
  if (!mongoose.Types.ObjectId.isValid(researchId)) {
    throw new AppError("Invalid research ID", 400);
  }

  const research = await researchModel.findById(researchId);
  if (!research) {
    throw new AppError("Research not found", 404);
  }

  // Check if reviewer is assigned to this research
  if (!research.reviewers.some((id) => id.toString() === reviewerId.toString())) {
    throw new AppError("Reviewer not assigned to this research", 403);
  }

  // Check if evaluation phase is valid
  if (!["pre-defense", "post-defense"].includes(evaluationPhase)) {
    throw new AppError("Invalid evaluation phase", 400);
  }

  // Determine which evaluation array and average score field to  use based on phase
  const evaluationArray =
    evaluationPhase === "pre-defense"
      ? research.preDefenseEvaluations
      : research.postDefenseEvaluations;
  const averageScoreField =
    evaluationPhase === "pre-defense"
      ? "averagePreDefenseScore"
      : "averagePostDefenseScore";

  // Check if reviewer has already submitted an evaluation for this phase
  if (
    evaluationArray.some((e) => e.reviewer.toString() === reviewerId.toString())
  ) {
    throw new AppError("Evaluation already submitted for this phase", 400);
  }
  if (typeof score !== "number" || score < 0 || score > 100) {
    throw new AppError("Score must be between 0 and 100", 400);
  }
  // Add new evaluation
  evaluationArray.push({ reviewer: reviewerId, score });

  // Recalculate average score
  research[averageScoreField] =
    evaluationArray.reduce((sum, e) => sum + e.score, 0) /
    evaluationArray.length;

  await research.save();

  await createEvent({
    actor: reviewerId,
    action:
      evaluationPhase === "pre-defense"
        ? "PRE_DEFENSE_EVALUATION_SUBMITTED"
        : "POST_DEFENSE_EVALUATION_SUBMITTED",
    target: researchId,
    metadata: { score },
  });

  const coordinator = await userModel.findOne({ role: "coordinator" }).select("_id");
  if (!coordinator) {
    throw new AppError("No coordinator found to notify", 404);
  }

  if (
    evaluationPhase === "pre-defense" &&
    research.preDefenseEvaluations.length === 3
  ) {
    await sendNotification({
      recipient: coordinator._id,
      recipientRole: "coordinator",
      message: `All ${evaluationPhase} evaluations completed for "${research.researchTitle}".`,
      researchId,
    });
  }

  return research;
};

export const getReviewerResearchListService = async (reviewerId) => {
  const assignedResearches = await researchModel
    .find({
      reviewers: reviewerId,
      status: { $in: ["under_review", "defence_scheduled"] },
    })
    .populate("researcher.id", "firstname lastname email")
    .sort({ createdAt: -1 });

  return assignedResearches;
};

export const getSingleResearchService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid research ID", 400);
  }

  const research = await researchModel
    .findById(id)
    .populate("researcher.id", "firstname lastname email")
    .populate("preDefenseEvaluations.reviewer", "firstname lastname email")
    .populate("postDefenseEvaluations.reviewer", "firstname lastname email");
  if (!research) {
    throw new AppError("Research not found", 404);
  }
  return research;
};
