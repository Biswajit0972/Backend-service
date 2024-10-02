import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const genarateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.genarateRefreshToken();
    const accessToken = user.genarateAccessToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (err) {
    throw new ApiError(500, "Something went's Wrong");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required! ");
  }

  const userIsexsits = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userIsexsits) throw new ApiError(409, "User is already registered");

  const newUser = await User.create({ fullname, email, username, password });

  if (!newUser)
    throw new ApiError(400, "Something went's wrong, while creating user!");

  const { _id: id } = newUser;
  const updatedUser = await User.findById(id).select([
    "-password",
    "-refreshToken",
  ]);

  res.status(200).send(updatedUser);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const findUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!findUser)
    throw new ApiError(404, "User not found please Sign up before sign in!");

  const verifyPassword = findUser.ispasswordCorrect(password);

  if (!verifyPassword) throw new ApiError(404, "Invalid candidate");

  const { refreshToken, accessToken } = await genarateTokens(findUser._id);

  const updateUser = await User.findById(findUser._id).select([
    "-password",
    "-refreshToken",
  ]);

  const options = {
    httpOnly: true,
    secure: true,
  };
  
  
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .send({
      user: updateUser,
      accessToken,
      message: "User Login Successfully",
    });
});

// Auth controller

export const logOut = asyncHandler(async (req, res) => {
  const userId = req?.user;
  await User.findByIdAndUpdate(
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
  };
  res
    .status(200)
    .cookie("refreshToken", options)
    .cookie("accessToken", options)
    .status(200)
    .send({
      message: "user log out",
    });
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req?.user;
  const { fullname, username } = req.body;
  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      fullname,
      username,
    },
    {
      new: true,
    }
  );

  const { refreshToken, accessToken } = await genarateTokens(updateUser?._id);

  const sendUser = await User.findById(updateUser?._id).select([
    "-password",
    "-refreshToken",
  ]);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .send({
      user: sendUser,
      accessToken,
      message: "User Login Succssfully",
    });
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req?.user;
  const { password: newPassword } = req.body;

  const user = await User.findById(userId);
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(202).send({ message: "password change succssfully" });
});

export const getUserData = asyncHandler(async (req, res) => {
  const userId = req.user;

  const userProfile = await User.aggregate([
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

  // console.log(userProfile)
  res.status(200).send(userProfile);
});
