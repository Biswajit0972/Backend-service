import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateTokens = async (userId) => {
  try {
    const User = await userModel.findById(userId);
    const refreshToken = User.generateRefreshToken();
    const accessToken = User.generateAccessToken();
    User.refreshToken = refreshToken;
    User.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (err) {
    throw new ApiError(500, "Something want's Wrong");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required! ");
  }

  const userIsexsits = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userIsexsits) throw new ApiError(409, "User is already registered");

  const newUser = await userModel.create({ fullName, email, username, password });

  if (!newUser)
    throw new ApiError(400, "Something went's wrong, while creating user!");

  const { _id: id } = newUser;

  const updatedUser = await userModel.findById(id).select([
    "-password",
    "-refreshToken",
  ]);

  res.status(200).send(new ApiResponse(200, "new user created", updatedUser));
});

export const loginUser = asyncHandler(async (req, res) => {

  const { identifier,  password } = req.body;

  if (identifier === "" && password === "") {
    throw new ApiError(401, "You don't have access to the user! please fill all the fields");
  }

  const findUser = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!findUser)
    throw new ApiError(404, "User not found please Sign up before sign in!");

  const verifyPassword = findUser.ispasswordCorrect(password);

  if (!verifyPassword) throw new ApiError(404, "Invalid candidate");

  const { refreshToken, accessToken } = await generateTokens(findUser._id);

  const updateUser = await userModel.findById(findUser._id).select([
    "-password",
    "-refreshToken",
  ]);

 const options = {
  httpOnly: true,  // Accessible only via HTTP(S), not JavaScript
  secure: true,    // Sent only over HTTPS
  sameSite: "None" // Prevents it from being considered as third-party in most cases
};

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .send(new ApiResponse(201, "user login successful!", {
      user: updateUser,
      accessToken,
    }));
});

export const logOut = asyncHandler(async (req, res) => {
  const userId = req?.user;
  await userModel.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("refreshToken", options)
    .cookie("accessToken", options)
    .status(200)
    .send(new ApiResponse(200, "logOut successfully", "", true));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req?.user;
  const { fullName, username } = req.body;
  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    {
      fullName,
      username,
    },
    {
      new: true,
    }
  );

  const { refreshToken, accessToken } = await genarateTokens(updateUser?._id);

  const sendUser = await userModel.findById(updateUser?._id).select([
    "-password",
    "-refreshToken",
  ]);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .send(new ApiResponse(201, "user updated successfully!", sendUser, true));
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req?.user;
  const {  newPassword, oldPassword } = req.body;

  const user = await userModel.findById(userId);

  if(!user._id) {
    throw new ApiError(401, "You don't have access to the user!");
  }

  const isValidUser = await user.ispasswordCorrect(oldPassword);
  
  if (!isValidUser) {
    throw new ApiError(401, "You don't have access to the user!");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res.status(202).send(new ApiResponse(200, "password  changed successfully!"));
});

export const getUserData = asyncHandler(async (req, res) => {
  const userId = req.user;

  const userProfile = await userModel.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "userId",
        as: "allpost",
      },
    },
    {
      $addFields: {
        totalNotes: {
          $size: "$allpost",
        },
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        email: 1,
        totalNotes: 1,
      },
    },
  ]);
  res.status(200).send(new ApiResponse(201, "", userProfile, true));
});
