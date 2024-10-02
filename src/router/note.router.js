import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { createNote, deleteNote, seeAllNotes, updateNote } from "../controllers/Notes.controller.js";

const noteRouter = express.Router();

noteRouter.route("/app/v1/createnotes").post(verifyAuth, createNote);
noteRouter.route("/app/v1/deletenotes").post(verifyAuth, deleteNote);
noteRouter.route("/app/v1/updatenotes").post(verifyAuth, updateNote);
noteRouter.route("/app/v1/seenotes").get(verifyAuth, seeAllNotes);
// noteRouter.route("/app/v1/seenotes").get( seeAllNotes);

export {noteRouter}