import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";

const verifyAuth = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Please Login or register");

    const { id } = jwt.verify(token, process.env.SECARTE_KEY);

    const isFoundUser = await User.findById(id);

    if (!isFoundUser)
      throw new ApiError("Token Expires or reuse please login again");
    req.user = isFoundUser._id;
    next();
  } catch (error) {
    throw new ApiError(500, error);
  }
});

export { verifyAuth };
