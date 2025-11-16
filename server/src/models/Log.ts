import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  level: "error" | "info";
  message: string;
  stack?: string;
  meta?: any;
}

const logSchema = new Schema<ILog>(
  {
    level: { type: String, enum: ["error", "info"], default: "error" },
    message: { type: String, required: true },
    stack: String,
    meta: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Log = mongoose.model<ILog>("Log", logSchema);
