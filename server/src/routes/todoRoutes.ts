import { Router } from "express";
import { z } from "zod";
import { Todo } from "../models/Todo.js";
import { type AuthRequest, protect } from "../middleware/auth.js";

const router = Router();

const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional()
});


router.use(protect);


router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const parsed = todoSchema.parse(req.body);
    const todo = await Todo.create({
      user: req.user._id,
      title: parsed.title,
      description: parsed.description,
      completed: parsed.completed ?? false
    });
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    const parsed = todoSchema.partial().parse(req.body);
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      parsed,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    next(error);
  }
});


router.patch("/:id/toggle", async (req: AuthRequest, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
