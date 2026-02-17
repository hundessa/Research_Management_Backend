import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js"
import loginRoute from "./routes/loginRoute.js";
import signUpRoute from "./routes/signUpRoute.js";
import researchRoute from "./routes/researchRoute.js";
import deanResearchRetrievalRoute from "./routes/dean_routes/deanResearchretrievalRoute.js";
import adminResearchRetrievalRoute from "./routes/admin_routes/adminResearchRetriavalRoute.js";
import adminNotificationRoute from "./routes/admin_routes/adminNotificationRoute.js";
import getResearchByIdRoute from "./routes/admin_routes/getResearchByIdRoute.js";
import adminStatusUpdateRoute from "./routes/admin_routes/adminStatusUpdateRoute.js";
import deanNotificationRoute from "./routes/dean_routes/deanNotificationRoute.js";
import coordinatorUserRetrivalRoute from "./routes/coordinator_routes/coordinatorUserRetriavalRoute.js";
import adminUserRetrievalRoute from "./routes/admin_routes/adminUserRetrievalRoute.js";
import coordinatorResearchRoute from "./routes/coordinator_routes/coordinatorResearchRoute.js";
import coordinatorNotificationRoute from "./routes/coordinator_routes/coordinatorNotificationRoute.js";
import { reviewerResearchListRoute } from "./routes/reviewer_routes/reviewerResearchListRoute.js";
import resercherNotificationRoute from "./routes/researcher_routes/researcerNotificationRoute.js";
import financeRouter from "./routes/researcher_routes/financeReleaseRoute.js";
import researcherResearchListRoute from "./routes/researcher_routes/researcherResearchListRoute.js";
import directorateNotificationRoute from "./routes/directorate_routes/directorateNotificationRoute.js";
import directorateFinanceRoute from "./routes/directorate_routes/directorateFinanceRoute.js";
import financeFinanceRoute from "./routes/finance_routes/financeRoutes.js";
import financeNotificationRoute from "./routes/finance_routes/financeNotificationRoute.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4001;
const CLIENT_URL = process.env.CLIENT_URL;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

console.log("ENV MONGO_URI:", process.env.MONGO_URI);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));


app.use("/", loginRoute);
app.use("/", signUpRoute);
app.use("/", researchRoute);
app.use("/", adminResearchRetrievalRoute);
app.use("/", adminNotificationRoute);
app.use("/", getResearchByIdRoute);
app.use("/", adminStatusUpdateRoute);
app.use("/", adminUserRetrievalRoute);
app.use("/", deanResearchRetrievalRoute);
app.use("/", deanNotificationRoute);
app.use("/", coordinatorUserRetrivalRoute);
app.use("/", coordinatorResearchRoute);
app.use("/", coordinatorNotificationRoute);
app.use("/", reviewerResearchListRoute);
app.use("/", resercherNotificationRoute);
app.use("/", financeRouter);
app.use("/", researcherResearchListRoute);
app.use("/", directorateNotificationRoute);
app.use("/", directorateFinanceRoute);
app.use("/", financeFinanceRoute);
app.use("/", financeNotificationRoute);

// mongoose
//   .connect(uri, { useNewurlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("Error connecting to MongoDB", error);
//   });

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      const existingAdmin = await User.findOne({ role: "admin" });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin@ha", 10);

        const newAdmin = new User({
          firstname: "admin",
          lastname: "adminn",
          username: "admin",
          email: "admin@mail.com",
          phonenumber: "0909090909",
          password: hashedPassword,
          role: "admin",
        });

        await newAdmin.save();
        console.log("Default admin user created.");
      } else {
        console.log("Admin user already exists.");
      }
    } catch (err) {
      console.error("Error checking/creating admin user:", err);
    }
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
