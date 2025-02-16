import {ApiError} from "./ApiError.js";
import {ApiResponse} from "./ApiResponse.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json(new ApiResponse(err.statusCode || 500, err.message || "Something went wrong", "", false));
  }
};

export default asyncHandler;
