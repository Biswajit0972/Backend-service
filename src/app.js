import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./router/user.router.js";
import { noteRouter } from "./router/note.router.js";

const app = express();
app.get("/", (req, res) => {
    res.send("hey ").status(200)
})
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(userRouter);
app.use(noteRouter);

export { app };
