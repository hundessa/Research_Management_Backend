import { adminGetAllUsersService } from "../services/adminServices.js";
import asyncHandler from "../utils/asyncHandler.js";

export const adminUserRetrievalController = asyncHandler(async (req, res) => {
  const users = await adminGetAllUsersService();
  res.status(200).json(users);
});

export const adminResearchesRetrievingController = async (req, res) => {
  const researches = await adminGetAllResearchesService();
  res.status(200).json(researches);
};

export const getResearchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const research = await adminGetOneResearchService(id);
  res.status(200).json(research);
});

export const adminResearchStatusUpdateController = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updatedResearch = await adminUpdateResearchStatusService(id, status, req.user._id);
    res
      .status(200)
      .json({
        message: "Research status updated successfully",
        data: updatedResearch,
      });
  },
);

export const getAdminNotifications = asyncHandler(async (req, res) => {
  const notifications = await getAdminNotificationsService();
  res.status(200).json(notifications);
});

