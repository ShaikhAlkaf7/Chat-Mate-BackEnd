import asyncErrorHandler from "../asyncErrorHandler.js";
import ErrorClass from "../errorClass.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegisterHandler = asyncErrorHandler(async (req, res, next) => {
  const { fullName, userName, password, email } = req.body;

  // validating the values getting from body
  if (!fullName || !userName || !password || !email)
    return next(new ErrorClass(400, "all fileds are required ", false));

  // checking user exists or not
  const userExists = await User.findOne({ userName });
  if (userExists)
    return next(new ErrorClass(400, "user name already exits", false));

  const hashedPassword = bcrypt.hashSync(password, 10);

  // now registering the user
  const user = await User.create({
    fullName,
    userName,
    email,
    password: hashedPassword,
  });

  if (!user) return next(new ErrorClass(404, "user creation failed", false));

  res.status(200).send({
    user,
    message: "User created successfully ",
    successs: true,
  });
});

export const loginUserHandler = asyncErrorHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  // validating the values getting from body
  if (!userName || !password)
    return next(new ErrorClass(400, "all fileds are required ", false));

  const user = await User.findOne({ userName });
  if (!user || user?.length < 0)
    return next(new ErrorClass(404, "User Not found Please Signup", false));

  // validating or camparing password
  const comparePassword = bcrypt.compareSync(password, user?.password);
  if (!comparePassword)
    return next(new ErrorClass(401, "Incorrect Email or Password"));

  // genrating token
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECREAT_KEY, {
    expiresIn: "1d",
  });

  // sending ok response
  res.status(200).send({
    success: true,
    message: "Login successfully",
    user,
    token,
  });
});

export const getOtherUser = asyncErrorHandler(async (req, res, next) => {
  const loggedInUserId = req?.user?.id;

  const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password"
  );

  res.status(200).send({
    success: true,
    message: "User fetch successfully ",
    otherUsers,
  });
});
