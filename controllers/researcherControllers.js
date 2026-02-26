import researchModel from "../models/researchModel.js";
import Notification from "../models/notificationModel.js";
import { io } from "../index.js";
import mongoose from "mongoose";
import FinanceRelease from "../models/financeReleaseModel.js";
import ProgressReport from "../models/progressReportModel.js";

export const researchController = async (req, res) => {
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
    const notification = await Notification.create({
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


export const researcherResearchList = async (req, res) => {
  try {
    // Get researcherId from query parameters instead of auth middleware
    const { researcherId } = req.query;

    if (!researcherId) {
      return res.status(400).json({
        success: false,
        message: "Researcher ID is required as a query parameter",
      });
    }

    console.log("Fetching researches for researcherId:", researcherId);

    if (!mongoose.Types.ObjectId.isValid(researcherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid researcher ID format",
      });
    }

    const researches = await Research.find({
      "researcher.id": new mongoose.Types.ObjectId(researcherId),
    }).populate("researcher.id", "firstname lastname email");

    res.status(200).json({
      success: true,
      count: researches.length,
      data: researches,
    });
  } catch (error) {
    console.error("Error fetching researcher's researches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch researcher's researches",
      error: error.message,
    });
  }
};


export const getSingleResearch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Research ID is required",
      });
    }

    console.log("Fetching research with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid research ID format",
      });
    }

    const research = await Research.findById(id).populate(
      "researcher.id",
      "firstname lastname email"
    );

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.status(200).json({
      success: true,
      data: research,
    });
  } catch (error) {
    console.error("Error fetching single research:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch research",
      error: error.message,
    });
  }
};


export const submitFinanceRequest = async (req, res) => {
  try {
    const { researchId, researcherId, amount, purpose, bankDetails } = req.body;

    // Parse bankDetails if needed
    const parsedBankDetails =
      typeof bankDetails === "string" ? JSON.parse(bankDetails) : bankDetails;

    // Validate required fields
    if (
      !researchId ||
      !researcherId ||
      !amount ||
      !purpose ||
      !parsedBankDetails
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate bank details
    if (
      !parsedBankDetails.accountName ||
      !parsedBankDetails.accountNumber ||
      !parsedBankDetails.bankName
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete bank details are required",
      });
    }


    // Create and save the finance request
    const financeRequest = new FinanceRelease({
      researchId,
      researcherId,
      amount,
      purpose,
      bankDetails: parsedBankDetails,
    });

    await financeRequest.save();

    // Create notification - with proper error handling
    try {
      const notification = new Notification({
        from: researcherId, // Who created this notification
        to: "directorate", // Or specific directorate user IDs
        recipientRole: "directorate",
        message: `New finance request submitted for research: ${research.researchTitle}`,
        link: `/directorate/finance-requests/${financeRequest._id}`,
        researchId,
        title: "Finance Request Submission",
        type: "finance_request",
        timestamp: new Date(),
      });

      await notification.save();
      console.log("Notification created successfully:", notification);
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the whole request if notification fails
    }

    res.status(201).json({
      success: true,
      message: "Finance request submitted successfully",
      data: financeRequest,
    });
  } catch (error) {
    console.error("Error submitting finance request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit finance request",
      error: error.message,
    });
  }
};

// Get finance releases for researcher
export const getResearcherFinanceReleases = async (req, res) => {
  try {
    const { researchId } = req.query;
    const query = {};

    if (researchId) {
      query.researchId = researchId;
    }

    const financeReleases = await FinanceRelease.find(query)
      .populate("researchId", "researchTitle status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: financeReleases.length,
      data: financeReleases,
    });
  } catch (error) {
    console.error("Error fetching finance releases:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch finance releases",
      error: error.message,
    });
  }
};


// Submit progress report
export const submitProgressReport = async (req, res) => {
  try {
    const {
      researchId,
      researcherId,
      amountSpent,
      report,
      attachments = [],
    } = req.body;

    // Validate all required fields
    if (!researchId || !researcherId || amountSpent === undefined || !report) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          researchId: !researchId,
          researcherId: !researcherId,
          amountSpent: amountSpent === undefined,
          report: !report,
        },
      });
    }

    // Validate ID formats
    if (
      !mongoose.Types.ObjectId.isValid(researchId) ||
      !mongoose.Types.ObjectId.isValid(researcherId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        details: {
          researchIdValid: mongoose.Types.ObjectId.isValid(researchId),
          researcherIdValid: mongoose.Types.ObjectId.isValid(researcherId),
        },
      });
    }

    

    // Create and save report
    const newReport = new ProgressReport({
      researchId,
      researcherId,
      amountSpent: Number(amountSpent),
      report,
      attachments,
      status: "submitted",
    });

    await newReport.save();

    return res.status(201).json({
      success: true,
      data: newReport,
    });
  } catch (error) {
    console.error("Progress report submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};


// Get researcher's progress reports
export const getProgressReports = async (req, res) => {
  try {
    const researcherId = req.user?._id;

    const reports = await ProgressReport.find({ researcherId })
      .sort({ createdAt: -1 })
      .populate('financeId', 'amount purpose');

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress reports',
    });
  }
};

export const getResearcherNotifications = async (req, res) => {
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

export const createNotification = async (req, res) => {
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