import {ApiError} from "./ApiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json(new ApiError(err.statusCode || 500, err.message || "Something went wrong",));
  }
};

export default asyncHandler;
