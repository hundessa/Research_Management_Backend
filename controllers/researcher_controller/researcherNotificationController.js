import Notification from "../../models/notificationModel.js"

const getResearcherNotifications = async (req, res) => {
  try {
    const { researcherId } = req.params; // Assuming you pass researcherId as param

    const notifications = await Notification.find({
      // to: researcherId,
      recipientRole: "researcher",
    })
      .sort({ timestamp: -1 })
      .limit(50); // Good practice to limit results

      res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const createNotification = async (req, res) => {
  try {
    const { from, to, recipientRole, message, title, type, researchId } =
      req.body;

    if (!from || !to || !recipientRole || !message || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const notification = new Notification({
      from,
      to,
      recipientRole,
      message,
      title,
      type: type || "finance_request",
      researchId: researchId || null,
      timestamp: new Date(),
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

export { getResearcherNotifications, createNotification };