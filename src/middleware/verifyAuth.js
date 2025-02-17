import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { userModel } from "../models/user.models.js";

const verifyAuth = asyncHandler(async (req, res, next) => {
    // Get the token from cookies or Authorization header
  const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, throw an unauthorized error
  if (!token) {
    throw new ApiError(401, "Please login or register.");
  }

  // Verify the token
  const { id } = jwt.verify(token, process.env.SECRET_KEY);
  // Check if the user exists in the database
  const isFoundUser = await userModel.findById(id);

  if (!isFoundUser) {
    throw new ApiError(401, "Invalid or expired token, please login again.");
  }

  req.user = isFoundUser._id;

  next();
});

export { verifyAuth };
