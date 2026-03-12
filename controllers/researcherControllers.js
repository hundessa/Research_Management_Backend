import {
  getResearcherNotificationsService,
  researcherResearchListService,
  submitResearchService,
  getSingleResearchService,
  submitProgressReportService,
  getResearcherFinanceReleasesService,
  getProgressReportsService
} from "../services/researcherServices.js";
import asyncHandler from "../utils/asyncHandler.js";

export const researchController = asyncHandler(async (req, res) => {
  const { researchTitle, researchType } = req.body;
  const researcherId = req.user._id;
  const researchFile = req.file;

  const research = await submitResearchService(
    researcherId,
    researchTitle,
    researchType,
    researchFile
  );
  res.status(201).json({
    success: true,
    message: "Research submitted successfully",
    data: research,
  });
});

export const researcherResearchList = asyncHandler( async (req, res) => {
  const researcherId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || "-createdAt";

  const researches = await researcherResearchListService(researcherId, page, limit, sort);
  res.status(200).json({
    success: true,
    ...researches
  });
});

export const getSingleResearch = asyncHandler( async (req, res) => {
    const { researchId } = req.params;

    const research = await getSingleResearchService(researchId);
    res.status(200).json({
      success: true,
      data: research,
    });

});

export const submitFinanceRequest = asyncHandler( async (req, res) => {
    const { researchId, amount, purpose, bankDetails } = req.body;
    const researcherId = req.user._id;
    const financeRelease = await submitFinanceService(
      researchId,
      researcherId,
      amount,
      purpose,
      bankDetails
    );

    res.status(201).json({
      success: true,
      message: "Finance request submitted successfully",
      data: financeRelease,
    });
});

// Get finance releases for researcher
export const getResearcherFinanceReleases = asyncHandler( async (req, res) => {
    const { researchId } = req.query;

    const financeReleases = await getResearcherFinanceReleasesService(researchId);
    res.status(200).json({
      success: true,
      data: financeReleases,
    });

});

// Submit progress report
export const submitProgressReport = asyncHandler( async (req, res) => {
    const {
      researchId,
      amountSpent,
      report,
      attachments = [],
    } = req.body;
    const researcherId = req.user._id

    const progressReport = await submitProgressReportService(
      researchId,
      researcherId,
      amountSpent,
      report,
      attachments
    );

    res.status(201).json({
      success: true,
      message: "Progress report submitted successfully",
      data: progressReport,
    });

});

// Get researcher's progress reports
export const getProgressReports = asyncHandler( async (req, res) => {
    const researcherId = req.user?._id;

    const progressReports = await getProgressReportsService(researcherId);
    res.status(200).json({
      success: true,
      data: progressReports,
    });
});

export const getResearcherNotifications = asyncHandler( async (req, res) => {
    const researcherId = req.user._id; 

    const notifications = await getResearcherNotificationsService(researcherId);
    res.status(200).json({
      success: true,
      data: notifications,
    });
});
