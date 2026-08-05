import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import researcherRoutes from "../routes/researcherRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import coordinatorRoutes from "../routes/coordinatorRoutes.js";
import reviewerRoutes from "../routes/reviewerRoutes.js";
import financeRoutes from "../routes/financeRoutes.js";
import directorateRoutes from "../routes/directorateRoutes.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { CLIENT_URL } from "../config/config.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import AppError from "../utils/AppError.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import { getUserNotifications } from "../controllers/notificationControllers.js";


const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
app.use("/coordinator", authMiddleware, authorizeRoles("coordinator"), coordinatorRoutes);
app.use("/reviewer", authMiddleware, authorizeRoles("reviewer"), reviewerRoutes);
app.use("/finance", authMiddleware, authorizeRoles("finance"), financeRoutes);
app.use("/directorate", authMiddleware, authorizeRoles("directorate"), directorateRoutes);
app.use("/notifications", authMiddleware, getUserNotifications);

// app.all("/*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl}`, 404));
// });
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

export default app;