import mongoose from "mongoose";
import Research from "../../models/researchModel.js";
import Notification from "../../models/notificationModel.js"

export const coordinatorResearchRetrivalController = async (req, res) => {
    try {
      const pendingResearches = await Research.find({
        $or: [
          { status: "pending" },
          { status: "underreview" },
          { status: "underdefence" },
          { status: "reviewed" },
          { status: "finalized" },
        ],
      });

        res.status(200).json(pendingResearches)
    } catch (error) {
        res.status(500).json({ message: "Server error: ", error})
    }
}



const getCoordinatorSingleResearchController = async (req, res) => {
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

const assignReviewersController = async (req, res) => {
  const { id } = req.params;
  const { status, reviewers } = req.body;

  console.log("Assigning reviewers:", { id, status, reviewers });

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid researchId:", id);
      return res.status(400).json({ message: "Invalid research ID" });
    }
    if (
      !Array.isArray(reviewers) ||
      reviewers.length !== 3 ||
      !reviewers.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      console.error("Invalid reviewers:", reviewers);
      return res
        .status(400)
        .json({ message: "Exactly 3 valid reviewer IDs are required" });
    }
    if (status !== "underreview") {
      console.error("Invalid status:", status);
      return res.status(400).json({ message: "Invalid status" });
    }

    const research = await Research.findById(id);
    if (!research) {
      console.error("Research not found:", id);
      return res.status(404).json({ message: "Research not found" });
    }

    research.status = status;
    research.reviewers = reviewers;
    await research.save();

    console.log("Reviewers assigned:", { researchId: id, status, reviewers });
    res.status(200).json(research);
  } catch (error) {
    console.error("Error assigning reviewers:", error);
    res
      .status(500)
      .json({ message: "Failed to assign reviewers", error: error.message });
  }
};

const assignDefenseDateController = async (req, res) => {
  const { id } = req.params;
  const { defenseDate } = req.body;

  console.log("Assigning defense date:", { id, defenseDate });

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid researchId:", id);
      return res.status(400).json({ message: "Invalid research ID" });
    }
    if (!defenseDate || isNaN(new Date(defenseDate).getTime())) {
      console.error("Invalid defenseDate:", defenseDate);
      return res.status(400).json({ message: "Invalid defense date" });
    }

    const research = await Research.findById(id);
    if (!research) {
      console.error("Research not found:", id);
      return res.status(404).json({ message: "Research not found" });
    }

    if (research.preDefenseEvaluations.length !== 3) {
      console.error(
        "Not all pre-defense evaluations submitted:",
        research.preDefenseEvaluations.length
      );
      return res.status(400).json({
        message:
          "Defense date can only be assigned after all three pre-defense evaluations are submitted",
      });
    }

    research.defenseDate = new Date(defenseDate);
    research.status = "underdefence";
    await research.save();

    console.log("Defense date assigned:", {
      researchId: id,
      defenseDate: research.defenseDate,
      status: research.status,
    });

    res.status(200).json({
      message: "Defense date assigned successfully",
      research: {
        _id: research._id,
        researchTitle: research.researchTitle,
        defenseDate: research.defenseDate,
        status: research.status,
        preDefenseEvaluations: research.preDefenseEvaluations,
        postDefenseEvaluations: research.postDefenseEvaluations,
        averagePreDefenseScore: research.averagePreDefenseScore,
        averagePostDefenseScore: research.averagePostDefenseScore,
      },
    });
  } catch (error) {
    console.error("Error assigning defense date:", error);
    res.status(500).json({
      message: "Failed to assign defense date",
      error: error.message,
    });
  }
};

const getCoordinatorUsersController = async (req, res) => {
  // Placeholder: Implement user fetching logic
  try {
    const users = await mongoose
      .model("User")
      .find({ role: "reviewer" }, "firstname lastname email");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};


const makeFinalDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, decisionComment } = req.body;

    // Validate input
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be either 'accepted' or 'rejected'",
      });
    }

    // Find the research
    const research = await Research.findById(id)
      .populate("researcher.id", "firstname lastname email")
      .populate("reviewers", "firstname lastname email");

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    // Check if research is in the correct state
    if (research.status !== "finalized") {
      return res.status(400).json({
        success: false,
        message: "Research must be in 'finalized' state to make final decision",
      });
    }

    // Check if all post-defense evaluations are completed
    if (
      !research.postDefenseEvaluations ||
      research.postDefenseEvaluations.length !== research.reviewers.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All reviewers must complete post-defense evaluations",
      });
    }

    // Update research status and calculate average score if not already calculated
    research.status = status;

    if (!research.averagePostDefenseScore) {
      const sum = research.postDefenseEvaluations.reduce(
        (total, evaluations) => total + evaluations.score,
        0
      );
      research.averagePostDefenseScore =
        sum / research.postDefenseEvaluations.length;
    }

    await research.save();

    // Create notification for researcher
    const notification = new Notification({
      message: `Your research "${research.researchTitle}" has been ${status}. ${
        decisionComment || ""
      }`,
      recipientRole: "researcher",
      isRead: false,
      timestamp: new Date(),
    });
    await notification.save();

    res.status(200).json({
      success: true,
      message: `Research ${status} successfully`,
      research,
    });
  } catch (error) {
    console.error("Error making final decision:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getCoordinatorSingleResearchController,
  assignReviewersController,
  assignDefenseDateController,
  getCoordinatorUsersController,
  makeFinalDecision
};