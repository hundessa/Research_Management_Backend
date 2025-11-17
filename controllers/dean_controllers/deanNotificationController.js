import Notification from "../../models/notificationModel.js";

const getDeanNotificationController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "dean",
    }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


const createDeanNotification = async (req, res) => {
  try {
    const { message, to } = req.body;

    const notification = new Notification({
      message,
      recipientRole: to || "coordinator", // or whoever it’s for
    });

    await notification.save();

    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

export { getDeanNotificationController, createDeanNotification };