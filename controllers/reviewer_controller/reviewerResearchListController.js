// import mongoose from "mongoose";
// import Research from "../../models/researchModel.js"


// const reviewerResearchListController = async (req, res) => {
//     const { reviewerId } = req.params;

//     try {
//         if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
//           return res.status(400).json({ error: "Invalid reviewer ID" });
//         }

//         const assignedResearches = await Research.find({
//           reviewers: new mongoose.Types.ObjectId(reviewerId),
//         }).populate("researcher.id", "firstname lastname email");

//         res.status(200).json(assignedResearches);
//     } catch (error) {
//         console.error("Error fetching assigned researches:", error);
//         res.status(500).json({ message: "Failed to fetch assigned researches." });
//     }
// };


// // NEW controller: get single research by ID
// const getSingleResearchController = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid research ID" });
//     }
//     console.log("Fetching research with ID:", id);

//     const research = await Research.findById(id).populate("researcher.id", "firstname lastname email");
//     if (!research) {
//       return res.status(404).json({ message: "Research not found" });
//     }

//     res.status(200).json(research);
//   } catch (error) {
//     console.error("Error fetching research:", error);
//     res.status(500).json({ message: "Failed to fetch research." });
//   }
// };

// // const submitEvaluationController = async (req, res) => {
// //   const { id } = req.params;
// //   const { reviewerId, evaluation } = req.body;

// //   try {
// //     // Validate score
// //     if (typeof evaluation !== "number" || evaluation < 0 || evaluation > 100) {
// //       return res
// //         .status(400)
// //         .json({ message: "Evaluation must be between 0 and 100" });
// //     }

// //     const research = await Research.findById(id);
// //     if (!research) {
// //       return res.status(404).json({ message: "Research not found" });
// //     }

// //     // Check if reviewer already submitted an evaluation
// //     const existingEvaluationIndex = research.evaluations.findIndex(
// //       (ev) => ev.reviewer.toString() === reviewerId
// //     );

// //     if (existingEvaluationIndex !== -1) {
// //       // Update existing evaluation
// //       research.evaluations[existingEvaluationIndex].evaluation = evaluation;
// //       research.evaluations[existingEvaluationIndex].submittedAt = new Date();
// //     } else {
// //       // Add new evaluation
// //       research.evaluations.push({
// //         reviewer: reviewerId,
// //         evaluation: evaluation,
// //       });
// //     }

// //     // Don't calculate average here - it will be calculated later
// //     // when all reviewers have submitted their evaluations

// //     await research.save();

// //     res.status(200).json({
// //       message: "Evaluation submitted successfully",
// //       evaluation: {
// //         reviewerId,
// //         evaluation,
// //         submittedAt: new Date(),
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error submitting evaluation:", error);
// //     res.status(500).json({ message: "Failed to submit evaluation" });
// //   }
// // };

// const submitEvaluationController = async (req, res) => {
//   const { id } = req.params;
//   const { reviewerId, score, evaluationPhase } = req.body;

//   try {
//     // Validate inputs
//     if (typeof score !== "number" || score < 0 || score > 100) {
//       return res.status(400).json({
//         success: false,
//         message: "Score must be between 0 and 100",
//       });
//     }

//     if (!["pre-defense", "post-defense"].includes(evaluationPhase)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid evaluation phase",
//       });
//     }

//     const research = await Research.findById(id);
//     if (!research) {
//       return res.status(404).json({
//         success: false,
//         message: "Research not found",
//       });
//     }

//     // Check if reviewer is assigned
//     if (!research.reviewers.some((r) => r.toString() === reviewerId)) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not assigned as a reviewer",
//       });
//     }

//     // Find existing evaluation for this phase
//     const evalIndex = research.evaluations.findIndex(
//       (e) =>
//         e.reviewer.toString() === reviewerId &&
//         e.evaluationPhase === evaluationPhase
//     );

//     // Update or create evaluation
//     if (evalIndex >= 0) {
//       if (evaluationPhase === "pre-defense") {
//         research.evaluations[evalIndex].preDefenseScore = score;
//       } else {
//         research.evaluations[evalIndex].postDefenseScore = score;
//       }
//       research.evaluations[evalIndex].status = "submitted";
//       research.evaluations[evalIndex].submittedAt = new Date();
//     } else {
//       research.evaluations.push({
//         reviewer: reviewerId,
//         [evaluationPhase === "pre-defense"
//           ? "preDefenseScore"
//           : "postDefenseScore"]: score,
//         evaluationPhase,
//         status: "submitted",
//       });
//     }

//     // Check if all reviewers have submitted for this phase
//     const allReviewersSubmitted = research.reviewers.every((reviewer) =>
//       research.evaluations.some(
//         (e) =>
//           e.reviewer.toString() === reviewer.toString() &&
//           e.evaluationPhase === evaluationPhase &&
//           e.status === "submitted"
//       )
//     );

//     // Update research status if all reviews are in
//     if (allReviewersSubmitted) {
//       if (evaluationPhase === "pre-defense") {
//         research.status = "pre-defense-reviewed";
//         // Calculate average pre-defense score
//         research.averagePreDefenseScore = calculateAverage(
//           research.evaluations,
//           "preDefenseScore",
//           "pre-defense"
//         );
//       } else {
//         research.status = "post-defense";
//         // Calculate average post-defense score
//         research.averagePostDefenseScore = calculateAverage(
//           research.evaluations,
//           "postDefenseScore",
//           "post-defense"
//         );
//       }
//     }

//     await research.save();

//     res.status(200).json({
//       success: true,
//       message: `${evaluationPhase} evaluation submitted successfully`,
//       researchStatus: research.status,
//       averageScore:
//         evaluationPhase === "pre-defense"
//           ? research.averagePreDefenseScore
//           : research.averagePostDefenseScore,
//     });
//   } catch (error) {
//     console.error("Evaluation submission error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit evaluation",
//       error: error.message,
//     });
//   }
// };


// export {
//   reviewerResearchListController,
//   getSingleResearchController,
//   submitEvaluationController,
// };


import mongoose from "mongoose";
import Research from "../../models/researchModel.js";

const submitEvaluationController = async (req, res) => {
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
const reviewerResearchListController = async (req, res) => {
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

const getSingleResearchController = async (req, res) => {
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

export {
  reviewerResearchListController,
  getSingleResearchController,
  submitEvaluationController,
};