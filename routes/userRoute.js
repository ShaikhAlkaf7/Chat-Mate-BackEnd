import express from "express";
import {
  loginUserHandler,
  userRegisterHandler,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", userRegisterHandler);
router.post("/login", loginUserHandler);

export default router;
