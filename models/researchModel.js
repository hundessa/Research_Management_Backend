import mongoose from "mongoose";

const researchSchema = new mongoose.Schema(
  {
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
        "submitted",
        "accepted",
        "under_review",
        "reviewed",
        "defence_scheduled",
        "defended",
        "finalized",
        "rejected",
      ],
      required: true,
    },
    researcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 reviewers required",
      },
    },
    preDefenseEvaluations: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    postDefenseEvaluations: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averagePreDefenseScore: {
      type: Number,
      default: null,
    },
    averagePostDefenseScore: {
      type: Number,
      default: null,
    },
    defenseDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Research", researchSchema);
