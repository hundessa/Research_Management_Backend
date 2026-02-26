import FinanceRequest from "../models/financeReleaseModel.js";
import Notification from "../models/notificationModel.js";

export const getFinanceRequests = async (req, res) => {
  try {
    const requests = await FinanceRequest.find()
      .populate("researchId", "researchTitle")
      .populate("researcherId", "name email");

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch finance requests",
      error: error.message,
    });
  }
};


export const approveFinanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const updatedRequest = await FinanceRequest.findByIdAndUpdate(
      requestId,
      { status: "approved", approvedAt: new Date() },
      { new: true }
    ).populate("researcherId", "name email");

    // Send notification to finance team
    await Notification.create({
      to: "finance",
      recipientRole: "finance",
      message: `New approved finance request from ${updatedRequest.researcherId.name} for research: ${updatedRequest.researchId}`,
      researchId: updatedRequest.researchId,
      type: "finance_request",
      title: "Finance Request Approval",
    });

    // Notify researcher
    await Notification.create({
      to: updatedRequest.researcherId._id,
      recipientRole: "researcher",
      message: `Your finance request for research ${updatedRequest.researchId} has been approved by the directorate.`,
      researchId: updatedRequest.researchId,
      type: "request_approved",
      title: "Finance Request Approved",
    });

    res.status(200).json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve finance request",
      error: error.message,
    });
  }
};


export const getDirectorateNotifications = async (req, res) => {
  try {
    const { directorateId } = req.params; // Assuming you pass researcherId as param

    const notifications = await Notification.find({
      to: directorateId,
      recipientRole: "directorate",
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

export const createNotification = async (req, res) => {
  try {
    const { from, to, recipientRole, message, title, type, researchId } =
      req.body;

    if (!to || !recipientRole || !message || !title) {
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
