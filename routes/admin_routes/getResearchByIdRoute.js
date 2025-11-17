import express from "express"
import { getResearchById } from "../../controllers/admin_controller/getResearchById.js";

const getResearchByIdRoute = express.Router();

getResearchByIdRoute.get('/admin/researches-list/:id', getResearchById);

export default getResearchByIdRoute;