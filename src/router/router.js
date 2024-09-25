import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { registerUser, loginUser, logOut, updateUser, changeUserPassword } from "../controllers/User.controller.js";
import { createNote, deleteNote, seeAllNotes, updateNote } from "../controllers/Notes.controller.js";

const router = express.Router();
router.route("/signup").post(registerUser)
router.route("/signin").post(loginUser)

// Auth routes
router.route("/logout").post(verifyAuth, logOut)
router.route("/updateprofile").post(verifyAuth, updateUser);
router.route("/changepassword").post(verifyAuth, changeUserPassword);
router.route("/createnotes").post(verifyAuth, createNote);
router.route("/deletenotes").post(verifyAuth, deleteNote);
router.route("/updatenotes").post(verifyAuth, updateNote);
router.route("/seenotes").get(verifyAuth, seeAllNotes);
export { router };
