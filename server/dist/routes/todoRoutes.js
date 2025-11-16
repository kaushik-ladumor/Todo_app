import { Router } from "express";
import { z } from "zod";
import { Todo } from "../models/Todo.js";
import { protect } from "../middleware/auth.js";
const router = Router();
const todoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    completed: z.boolean().optional()
});
// All routes need auth
router.use(protect);
// POST /api/todos
router.post("/", async (req, res, next) => {
    try {
        const parsed = todoSchema.parse(req.body);
        const todo = await Todo.create({
            user: req.user._id,
            title: parsed.title,
            description: parsed.description,
            completed: parsed.completed ?? false
        });
        res.status(201).json(todo);
    }
    catch (error) {
        next(error);
    }
});
// GET /api/todos
router.get("/", async (req, res, next) => {
    try {
        const todos = await Todo.find({ user: req.user._id }).sort({
            createdAt: -1
        });
        res.json(todos);
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/todos/:id
router.put("/:id", async (req, res, next) => {
    try {
        const parsed = todoSchema.partial().parse(req.body);
        const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, parsed, { new: true });
        if (!todo)
            return res.status(404).json({ message: "Todo not found" });
        res.json(todo);
    }
    catch (error) {
        next(error);
    }
});
// PATCH /api/todos/:id/toggle
router.patch("/:id/toggle", async (req, res, next) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
        if (!todo)
            return res.status(404).json({ message: "Todo not found" });
        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/todos/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!todo)
            return res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Todo deleted" });
    }
    catch (error) {
        next(error);
    }
});
export default router;
