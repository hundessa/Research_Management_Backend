import asyncHandler from "../utils/asyncHandler.js";
import { assignDefenseDateService, coordinatorAssignReviewersService, coordinatorGetAllResearchesService, coordinatorGetAllUsersService, coordinatorGetNotificationsService, coordinatorGetOneResearchService, makeFinalDecisionService } from "../services/coordinatorServices.js";


export const coordinatorGetAllUsersController = asyncHandler( async (req, res) => {
  const users = await coordinatorGetAllUsersService();
  res.status(200).json(users);
})
export const coordinatorResearchRetrivalController = asyncHandler( async (req, res) => {
  const researches = await coordinatorGetAllResearchesService();
  res.status(200).json(researches);
});


export const getCoordinatorSingleResearchController = asyncHandler(async (req, res) => {
  const { id } = req.params;

const research= await coordinatorGetOneResearchService(id);
  res.status(200).json(research);
});


export const assignReviewersController = asyncHandler( async (req, res) => {
  const { id } = req.params;
  const { status, reviewers } = req.body;

  const updatedResearch = await coordinatorAssignReviewersService(id, reviewers, status);
  res.status(200).json({
    message: "Reviewers assigned successfully",
    data: updatedResearch,
  });

});


export const assignDefenseDateController = asyncHandler( async (req, res) => {
  const { id } = req.params;
  const { defenseDate } = req.body;

const research = await assignDefenseDateService(id, defenseDate);
  res.status(200).json({
    message: "Defense date assigned successfully",
    data: research,
  });
});


export const makeFinalDecision = asyncHandler( async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  const research = await makeFinalDecisionService(id, decision);
  res.status(200).json({
    message: "Final decision made successfully",
    data: research,
  });
});


export const getCoordinatorNotifications = asyncHandler( async (req, res) => {
const coordinatorId = req.user._id;
const notifications = await coordinatorGetNotificationsService(coordinatorId);
res.status(200).json(notifications);
});