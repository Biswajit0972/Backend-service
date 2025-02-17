import { noteModel } from "../models/note.model.js";
import { userModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const createNote = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) throw new ApiError(400, "Please login to create a notes");

  const { content } = req.body;

  const findUser = await userModel.findById(userId);

  if (!findUser?._id) {
    throw new ApiError(404, "User not found!");
  }

  const note = await noteModel.create({ userId, content });

  const findNote = await noteModel.findById(note?._id).select("-userId");

  if (!findNote)
    throw new ApiError(
      402,
      "There is a problem while creating notes, Please try again later!"
    );
  res.status(200).send(new ApiResponse(200, "Note successfully created!", findNote, true));
});

export const updateNote = asyncHandler(async (req, res) => {
  const userID = req?.user;
  const noteId = req.query.id;
  const { content } = req.body;

  if (!userID) {
    throw new ApiError(401, "Please login to update a notes");
  }

  if ([content, noteId].some((field) => field.trim() === ""))
    throw new ApiError(402, "All fields are required");

  const findPost = await noteModel.findById(noteId);

  if (!findPost?._id)
    throw new ApiError(404, "The note is doesn't exists on database");

  const updatedNote = await noteModel.findByIdAndUpdate(
    noteId,
    { content },
    { new: true }
  ).select("-userId");

  if (!updateNote)
    throw new ApiError(500, "Something went's wrong please try again later");

  res.status(201).send(new ApiResponse(201, "Note successfully updated!", updateNote, true));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const userId = req.user;
  const noteId = req.query.id;

  if (!userId || !noteId)
    throw new ApiError(404, "All fields are required to delete a post");


  const isNote = await noteModel.findById(noteId);
  if (!isNote?._id) throw new ApiError(404, "Note is already deleted.");

  await noteModel.deleteOne(isNote?._id);

  res.status(200).send(new ApiResponse(201, "Note successfully deleted!", "", true));
});

export const seeAllNotesByUserId = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) throw new ApiError(400, "Please login to see all notes");

  const allNotes = await noteModel.aggregate([
    {
      $match: {
        userId,
      },
    },
    {
      $limit: 5,
    },
    {
      $skip: 1,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
      },
    },
    {
      $addFields: {
        username: "$owner.username",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        username: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (!allNotes) throw new ApiError(400, "there is an problem");

  res.status(200).send(new ApiResponse(200, "", allNotes, true));
});

export const getNotes = asyncHandler(async (req, res) => {

  const {page,limit} = req.query;

  const pageNum = page || 1;
  const limitNum = limit || 3;

  const skip = (pageNum - 1) * limit;

  const getAllNotes = await noteModel.find().skip(skip).limit(limitNum);

  res.status(200).send(new ApiResponse(200, "Notes", getAllNotes, true));
});

export const getNoteById = asyncHandler(async (req, res) => {
  const {id} = req.query;

  if (!id) throw new ApiError(400, "Please add valid post id");

  const getNote = await noteModel.findById(id);
  if (!getNote) {
    res.status(404).send(new ApiResponse(404, "Not found", null, true));
  }

  res.status(200).send(new ApiResponse(200, "note found", getNote, true));
})