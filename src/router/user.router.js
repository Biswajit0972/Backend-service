import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { registerUser, loginUser, logOut, updateUser, changeUserPassword, getUserData } from "../controllers/User.controller.js";
const userRouter = express.Router();
userRouter.route("/v1/signup").post(registerUser)
userRouter.route("/v1/signin").post(loginUser)

// Auth routes
userRouter.route("/v1/logout").get(verifyAuth, logOut)
userRouter.route("/v1/updateprofile").post(verifyAuth, updateUser);
userRouter.route("/v1/changepassword").post(verifyAuth, changeUserPassword);
userRouter.route("/v1/getuser").get(verifyAuth, getUserData);

export {userRouter}