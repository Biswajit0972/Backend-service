import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./router/user.router.js";
import { noteRouter } from "./router/note.router.js";

const app = express();

app.get("/", (_, res) => {
    res.status(200).send("welcome to the backend-service")
})

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(userRouter);
app.use(noteRouter);

export { app };
