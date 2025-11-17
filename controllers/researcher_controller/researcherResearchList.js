import mongoose from "mongoose";
import Research from "../../models/researchModel.js";

const researcherResearchList = async (req, res) => {
  try {
    // Get researcherId from query parameters instead of auth middleware
    const { researcherId } = req.query;

    if (!researcherId) {
      return res.status(400).json({
        success: false,
        message: "Researcher ID is required as a query parameter",
      });
    }

    console.log("Fetching researches for researcherId:", researcherId);

    if (!mongoose.Types.ObjectId.isValid(researcherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid researcher ID format",
      });
    }

    const researches = await Research.find({
      "researcher.id": new mongoose.Types.ObjectId(researcherId),
    }).populate("researcher.id", "firstname lastname email");

    res.status(200).json({
      success: true,
      count: researches.length,
      data: researches,
    });
  } catch (error) {
    console.error("Error fetching researcher's researches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch researcher's researches",
      error: error.message,
    });
  }
};


const getSingleResearch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Research ID is required",
      });
    }

    console.log("Fetching research with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid research ID format",
      });
    }

    const research = await Research.findById(id).populate(
      "researcher.id",
      "firstname lastname email"
    );

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.status(200).json({
      success: true,
      data: research,
    });
  } catch (error) {
    console.error("Error fetching single research:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch research",
      error: error.message,
    });
  }
};




export { researcherResearchList, getSingleResearch };
