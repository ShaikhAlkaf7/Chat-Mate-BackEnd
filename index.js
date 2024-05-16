import express from "express";
import connectDB from "./config/connectDb.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import { app, server } from "./socket/socket.js";
dotenv.config({});

// const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors({ origin: "https://chat-mate-front-end.vercel.app" }));

// all routes goes here
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

app.use("*", (req, res) => {
  res.send({
    success: false,
    message: "Page Not found ",
  });
});

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

server.listen(PORT, () => {
  connectDB();
  console.log("server is runnig");
});
