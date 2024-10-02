import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import { userRouter } from "./router/user.router.js";
import { noteRouter } from "./router/note.router.js";

const app = express();

// const corsOptions = {
//   origin: "*",
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(200).send(somes);
});

app.use(userRouter);
app.use(noteRouter);

export { app };
