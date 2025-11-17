import express from "express";
import researchController from "../controllers/researchController.js";

const researchRoute = express.Router();

researchRoute.post('/research-upload', researchController);

export default researchRoute;
