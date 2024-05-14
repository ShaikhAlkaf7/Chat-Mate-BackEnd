import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  getMessageController,
  sendMessageController,
} from "../controller/messageController.js";
const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessageController); // sending the messages
router.get("/:id", isAuthenticated, getMessageController); // getting the message

export default router;
