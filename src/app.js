import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import { userRouter } from "./router/user.router.js";
import { noteRouter } from "./router/note.router.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173/",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(200).send("welcome to the backend-service");
});

app.use(userRouter);
app.use(noteRouter);

export { app };
