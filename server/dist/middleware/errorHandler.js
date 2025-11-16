import { Log } from "../models/Log.js";
export const errorHandler = async (err, _req, res, _next) => {
    console.error("Error:", err);
    // Save to Mongo logs collection
    try {
        await Log.create({
            level: "error",
            message: err.message || "Unknown error",
            stack: err.stack,
            meta: err.meta || {}
        });
    }
    catch (logError) {
        console.error("Failed to log error:", logError);
    }
    res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Server error" });
};
