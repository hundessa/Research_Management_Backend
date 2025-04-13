import mongoose from "mongoose";

const researchModel = new mongoose.Schema({
  researchTitle: {
    type: String,
    required: true,
  },
  researchType: {
    type: String,
    enum: ["normalresearch", "communityengagement"],
    required: true,
  },
  researchFile: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "draft",
      "submitted",
      "reviewed",
      "underdefence",
      "finalized",
      "accepted",
      "rejected",
    ],
  },
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

export default mongoose.model("Research", researchModel);
