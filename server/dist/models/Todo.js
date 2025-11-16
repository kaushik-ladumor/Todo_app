import mongoose, { Schema } from "mongoose";
const todoSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false }
}, { timestamps: true });
export const Todo = mongoose.model("Todo", todoSchema);
