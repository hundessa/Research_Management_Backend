import FinanceRequest from "../models/financeReleaseModel.js";
import Notification from "../models/notificationModel.js";

export const getFinanceRequests = async (req, res) => {
  try {
    const requests = await FinanceRequest.find({ status: "approved" })
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

// Approve finance request
export const approveFinanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const updatedRequest = await FinanceRequest.findByIdAndUpdate(
      requestId,
      { status: "proccesed", approvedAt: new Date() },
      { new: true }
    ).populate("researcherId", "name email");

    // Send notification to finance team
    await Notification.create({
      to: "finance",
      recipientRole: "finance",
      message: `New processed finance request from ${updatedRequest.researcherId.name} for research: ${updatedRequest.researchId}`,
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


export const sendFinanceNotification = async (req, res) => {
  const { to, message, researchId, recipientRole, title, type, file } = req.body;

  if (!to || !message || !researchId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const notification = new Notification({
      to,
      message,
      researchId,
      title,
      type,
      file,
      recipientRole,
    });

    await notification.save();

    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const getFinanceNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "finance",
    }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};