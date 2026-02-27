import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import researcherRoutes from "../routes/researcherRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import deanRoutes from "../routes/deanRoutes.js";
import coordinatorRoutes from "../routes/coordinatorRoutes.js";
import reviewerRoutes from "../routes/reviewerRoutes.js";
import financeRoutes from "../routes/financeRoutes.js";
import directorateRoutes from "../routes/directorateRoutes.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { CLIENT_URL } from "../config/config.js";


const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


app.use("/auth", authRoutes);
app.use("/researcher", researcherRoutes);
app.use("/admin", adminRoutes);
app.use("/dean", deanRoutes);
app.use("/coordinator", coordinatorRoutes);
app.use("/reviewer", reviewerRoutes);
app.use("/finance", financeRoutes);
app.use("/directorate", directorateRoutes);

app.use(errorMiddleware);

export default app;