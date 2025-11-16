import mongoose, { Schema } from "mongoose";
const logSchema = new Schema({
    level: { type: String, enum: ["error", "info"], default: "error" },
    message: { type: String, required: true },
    stack: String,
    meta: Schema.Types.Mixed
}, { timestamps: true });
export const Log = mongoose.model("Log", logSchema);
