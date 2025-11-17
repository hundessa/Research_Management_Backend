import mongoose from "mongoose";

const ProgressReportSchema = new mongoose.Schema(
  {
    researcherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Researcher ID is required"],
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v),
        message: "Invalid researcher ID format",
      },
    },
    researchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Research",
      required: [true, "Research ID is required"],
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v),
        message: "Invalid research ID format",
      },
    },
    amountSpent: {
      type: Number,
      required: [true, "Amount spent is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    report: {
      type: String,
      required: [true, "Report content is required"],
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "reviewed"],
        message: "Invalid status value",
      },
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProgressReport", ProgressReportSchema);
