// models/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  recipientRole: {
    type: String,
    enum: [
        "admin",
        "dean",
      "researcher",
      "reviewer",
      "coordinator",
      "directorate",
      "finance",
    ], // you can extend this
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
