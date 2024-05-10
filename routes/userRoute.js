import express from "express";
import {
  getOtherUser,
  loginUserHandler,
  userRegisterHandler,
} from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", userRegisterHandler);
router.post("/login", loginUserHandler);
router.get("/", isAuthenticated, getOtherUser);

export default router;
