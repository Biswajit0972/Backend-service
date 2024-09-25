import { Note } from "../models/note.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";

// create a new notes
export const createNote = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) throw new ApiError(400, "Please login to create a notes");

  const { content } = req.body;

  const findUser = await User.findById(userId);

  if (!findUser?._id) {
    throw new ApiError(404, "User not found!");
  }

  const note = await Note.create({ userId, content });

  const findNote = await Note.findById(note?._id).select("-userId");
  if (!findNote)
    throw new ApiError(
      402,
      "There is a problem while creating notes, Please try again later!"
    );
  res.status(200).send({
    Note: findNote,
  });
});

export const updateNote = asyncHandler(async (req, res) => {
  const userID = req?.user;
  const { content, noteId } = req.body;

  if (!userID) throw new ApiError(400, "Please login to create a notes");

  if ([content, noteId].some((field) => field.trim() === ""))
    throw new ApiError(402, "All fields are required");

  const findPost = await Note.findById(noteId);

  if (!findPost?._id)
    throw new ApiError(404, "The note is doesn't exists on database");

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { content },
    { new: true }
  ).select("-userId");

  if (!updateNote)
    throw new ApiError(500, "Something went's wrong please try again later");

  res.status(201).send({
    updateNOTE: updatedNote,
  });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const userId = req.user;
  const noteId = req.query.id;
  if (!userId || !noteId)
    throw new ApiError(404, "All fields are required to delete a post");

  const isUser = await User.findById(userId);
  if (!isUser?._id) throw new ApiError(404, "please login to delete a post");

  const isNote = await Note.findById(noteId);
  if (!isNote?._id) throw new ApiError(404, "Note is already deleted.");

  await Note.deleteOne(isNote?._id);

  res.status(200).send("Note is delete succssfully.");
});

export const seeAllNotes = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) throw new ApiError(400, "Please login to see all notes");
  const allNotes = await Note.find({ userId });
  if (!allNotes) throw new ApiError(400, "there is an problem");
  res.status(200).send(allNotes);
});
