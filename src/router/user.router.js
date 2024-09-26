import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { registerUser, loginUser, logOut, updateUser, changeUserPassword, getUserData } from "../controllers/User.controller.js";
const userRouter = express.Router();
userRouter.route("/app/v1/signup").post(registerUser)
userRouter.route("/app/v1/signin").post(loginUser)

// Auth routes
userRouter.route("/app/v1/logout").get(verifyAuth, logOut)
userRouter.route("/app/v1/updateprofile").post(verifyAuth, updateUser);
userRouter.route("/app/v1/changepassword").post(verifyAuth, changeUserPassword);
userRouter.route("/app/v1/getuser").get(verifyAuth, getUserData);

export {userRouter}