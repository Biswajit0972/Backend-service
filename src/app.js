import express from "express"
import cookieParser from "cookie-parser";
import { router } from "./router/router.js";


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(router);

export {app};