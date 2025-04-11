import express from "express";
import loginRoute from "./routes/loginRoute";
import signUpRoute from "./routes/signUpRoute";
import mongoose from "mongoose";
import researchRoute from "./routes/researchRoute";

const uri = "mongodb://localhost:27017/research_management";
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ extended: true }));

app.use("/", loginRoute);
app.use("/", signUpRoute);
app.use("/", researchRoute);

mongoose
  .connect(uri, { useNewurlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(4001, () => {
  console.log("server listening on port 4001");
});
