import express from "express";
import { getSingleResearch, researcherResearchList } from "../../controllers/researcher_controller/researcherResearchList.js";

const researcherResearchListRoute = express.Router();

researcherResearchListRoute.get("/researcher/researches-list", researcherResearchList);
researcherResearchListRoute.get("/researcher/researches-list/:id", getSingleResearch);

export default researcherResearchListRoute;