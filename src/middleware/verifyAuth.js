import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";

const verifyAuth = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from cookies or Authorization header
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // If no token is found, throw an unauthorized error
    if (!token) {
      throw new ApiError(401, "Please login or register.");
    }

    // Verify the token
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the user exists in the database
    const isFoundUser = await User.findById(id);

    // If user is not found, throw an unauthorized error
    if (!isFoundUser) {
      throw new ApiError(401, "Invalid or expired token, please login again.");
    }

    // Attach the user ID to the request object for further use
    req.user = isFoundUser._id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch JWT verification errors or other issues
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token, please login again.");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired, please login again.");
    }

    // General error handler
    throw new ApiError(500, "Authentication error");
  }
});

export { verifyAuth };
