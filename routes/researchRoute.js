import express from "express";
import researchController from "../controllers/researchController";

const researchRoute = express.Router();

researchRoute.post('/research-upload', researchController);

export default researchRoute;
