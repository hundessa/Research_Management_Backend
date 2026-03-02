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
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";


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
app.use("/researcher", authMiddleware, authorizeRoles("researcher"), researcherRoutes);
app.use("/admin", authMiddleware, authorizeRoles("admin"), adminRoutes);
app.use("/dean", authMiddleware, authorizeRoles("dean"), deanRoutes);
app.use("/coordinator", authMiddleware, authorizeRoles("coordinator"), coordinatorRoutes);
app.use("/reviewer", authMiddleware, authorizeRoles("reviewer"), reviewerRoutes);
app.use("/finance", authMiddleware, authorizeRoles("finance"), financeRoutes);
app.use("/directorate", authMiddleware, authorizeRoles("directorate"), directorateRoutes);

// app.all("/*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl}`, 404));
// });
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

export default app;