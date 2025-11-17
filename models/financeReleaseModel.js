import mongoose from "mongoose";

const financeReleaseSchema = new mongoose.Schema({
  researchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Research",
    required: true,
  },
  researcherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
  },
  bankDetails: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "processed"],
    default: "pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const FinanceRelease = mongoose.model("FinanceRelease", financeReleaseSchema);
export default FinanceRelease;
