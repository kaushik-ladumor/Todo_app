import type { Request, Response, NextFunction } from "express";
import { Log } from "../models/Log.js";

export const errorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);

  // Save to Mongo logs collection
  try {
    await Log.create({
      level: "error",
      message: err.message || "Unknown error",
      stack: err.stack,
      meta: err.meta || {}
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }

  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server error" });
};
