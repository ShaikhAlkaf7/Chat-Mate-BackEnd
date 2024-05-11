import express from "express";
import connectDB from "./config/connectDb.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import dotenv from "dotenv";
dotenv.config({});

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

// all routes goes here
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// error handler middlerware
app.use((err, req, res, next) => {
  const {
    status = 500,
    message = "Something went wrong",
    success = false,
  } = err;
  console.log(err);
  res.status(status).send({ message: message, success: success });
});

app.listen(PORT, () => {
  connectDB();
  console.log("server is runnig");
});
