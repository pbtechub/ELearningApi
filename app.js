import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { HandlerError } from "./middleware/error.js";
import userRouter from "./routes/user.js";
import courseRouter from "./routes/courses.js";

dotenv.config();

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// testing api

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} is not found!`);
  err.statusCode = 404;
  next(err);
});

app.use(HandlerError);
