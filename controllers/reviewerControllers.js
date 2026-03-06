import { reviewerSubmitEvaluationService, getSingleResearchService, getReviewerResearchListService } from "../services/reviewerServices.js";
import asyncHandler from "../utils/asyncHandler.js";

export const submitEvaluationController = asyncHandler(async (req, res) => {
 const { researchId } = req.params;
 const reviewerId = req.user._id;
 const { score, evaluationPhase } = req.body;

 const result = await reviewerSubmitEvaluationService(researchId, reviewerId, evaluationPhase, score);
  res.status(200).json(result);
});

// Update other controllers to return new fields
export const reviewerResearchListController = asyncHandler(async (req, res) => {
  const reviewerId  = req.user._id;

  const assignedResearches = await getReviewerResearchListService(reviewerId);
  res.status(200).json(assignedResearches);
});

export const getSingleResearchController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const research = await getSingleResearchService(id);
  res.status(200).json(research);
});