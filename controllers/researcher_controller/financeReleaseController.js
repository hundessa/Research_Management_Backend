import FinanceRelease from "../../models/financeReleaseModel.js";
import Research from "../../models/researchModel.js";
import Notification from "../../models/notificationModel.js";
import ProgressReport from "../../models/progressReportModel.js";


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