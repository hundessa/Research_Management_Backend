import { io } from "../index.js";
import notificationModel from "../models/notificationModel.js";
import researchModel from "../models/researchModel.js";

const researchController = async (req, res) => {
  const { researchTitle, researchType, researchFile, status, researcher } = req.body;

  try {
    const newResearch = await researchModel.create({
      researchTitle,
      researchType,
      researchFile,
      status,
      researcher,
    });
    console.log(researcher);

    // ✅ Create notification for admin
    const notification = await notificationModel.create({
      message: `New research "${researchTitle}" uploaded by a researcher.`,
      recipientRole: "admin",
    });

    console.log("Notification created:", notification);

    io.emit("new-research-uploaded", {
      id: notification._id,
      title: "New Research Uploaded",
      content: notification.message,
      timestamp: notification.timestamp,
    });

    res.status(200).json({ message: "File uploaded successfuly" });
  } catch (error) {
      console.log("Error during research uploading", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default researchController;
