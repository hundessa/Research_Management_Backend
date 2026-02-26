import mongoose from "mongoose";
import Research from "../models/researchModel.js";

export const submitEvaluationController = async (req, res) => {
  const { id: researchId } = req.params;
  const { score, reviewerId, evaluationPhase } = req.body;

  console.log("Submitting evaluation:", {
    researchId,
    reviewerId,
    score,
    evaluationPhase,
  });

  try {
    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(researchId)) {
      console.error("Invalid researchId:", researchId);
      return res.status(400).json({ message: "Invalid research ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
      console.error("Invalid reviewerId:", reviewerId);
      return res.status(400).json({ message: "Invalid reviewer ID" });
    }
    if (typeof score !== "number" || score < 0 || score > 100) {
      console.error("Invalid score:", score);
      return res
        .status(400)
        .json({ message: "Score must be a number between 0 and 100" });
    }
    if (!["pre-defense", "post-defense"].includes(evaluationPhase)) {
      console.error("Invalid evaluationPhase:", evaluationPhase);
      return res.status(400).json({ message: "Invalid evaluation phase" });
    }

    // Find research
    const research = await Research.findById(researchId);
    if (!research) {
      console.error("Research not found:", researchId);
      return res.status(404).json({ message: "Research not found" });
    }

    // Verify reviewer is assigned
    if (!research.reviewers.some((r) => r.equals(reviewerId))) {
      console.error("Reviewer not assigned:", reviewerId, researchId);
      return res
        .status(403)
        .json({ message: "You are not assigned to this research" });
    }

    // Select evaluation array based on phase
    const evaluationArray =
      evaluationPhase === "pre-defense"
        ? research.preDefenseEvaluations
        : research.postDefenseEvaluations;
    const averageScoreField =
      evaluationPhase === "pre-defense"
        ? "averagePreDefenseScore"
        : "averagePostDefenseScore";

    // Check for existing evaluation
    if (evaluationArray.some((e) => e.reviewer.equals(reviewerId))) {
      console.error(
        `Reviewer already submitted ${evaluationPhase} evaluation:`,
        reviewerId,
        researchId
      );
      return res
        .status(400)
        .json({
          message: `You have already submitted a ${evaluationPhase} evaluation`,
        });
    }

    // Validate phase-specific conditions
    if (evaluationPhase === "post-defense" && !research.defenseDate) {
      console.error(
        "Post-defense evaluation attempted without defense date:",
        researchId
      );
      return res
        .status(400)
        .json({ message: "Post-defense evaluations require a defense date" });
    }

    // Add evaluation
    evaluationArray.push({
      reviewer: reviewerId,
      score,
    });

    // Compute average score
    if (evaluationArray.length > 0) {
      const totalScore = evaluationArray.reduce(
        (sum, evaluation) => sum + evaluation.score,
        0
      );
      research[averageScoreField] = totalScore / evaluationArray.length;
    }

    // Update status
    if (
      evaluationPhase === "pre-defense" &&
      research.preDefenseEvaluations.length === 3
    ) {
      research.status = "reviewed";
    } else if (
      evaluationPhase === "post-defense" &&
      research.postDefenseEvaluations.length === 3
    ) {
      research.status = "finalized";
    }

    await research.save();

    console.log("Evaluation submitted:", {
      researchId,
      reviewerId,
      score,
      evaluationPhase,
      [averageScoreField]: research[averageScoreField],
      status: research.status,
    });

    res.status(200).json({
      message: "Evaluation submitted successfully",
      research: {
        _id: research._id,
        researchTitle: research.researchTitle,
        preDefenseEvaluations: research.preDefenseEvaluations,
        postDefenseEvaluations: research.postDefenseEvaluations,
        averagePreDefenseScore: research.averagePreDefenseScore,
        averagePostDefenseScore: research.averagePostDefenseScore,
        status: research.status,
      },
    });
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    res
      .status(500)
      .json({ message: "Failed to submit evaluation", error: error.message });
  }
};

// Update other controllers to return new fields
export const reviewerResearchListController = async (req, res) => {
  const { reviewerId } = req.params;

  console.log("Fetching researches for reviewerId:", reviewerId);

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
      console.error("Invalid reviewerId:", reviewerId);
      return res.status(400).json({ message: "Invalid reviewer ID" });
    }

    const assignedResearches = await Research.find({
      reviewers: new mongoose.Types.ObjectId(reviewerId),
    }).populate("researcher.id", "firstname lastname email");

    console.log("Fetched researches:", assignedResearches.length, "items");
    res.status(200).json(assignedResearches);
  } catch (error) {
    console.error("Error fetching assigned researches:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch assigned researches",
        error: error.message,
      });
  }
};

export const getSingleResearchController = async (req, res) => {
  const { id } = req.params;

  console.log("Fetching research with ID:", id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid researchId:", id);
      return res.status(400).json({ message: "Invalid research ID" });
    }

    const research = await Research.findById(id)
      .populate("researcher.id", "firstname lastname email")
      .populate("preDefenseEvaluations.reviewer", "firstname lastname email")
      .populate("postDefenseEvaluations.reviewer", "firstname lastname email");
    if (!research) {
      console.error("Research not found:", id);
      return res.status(404).json({ message: "Research not found" });
    }

    res.status(200).json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch research", error: error.message });
  }
};