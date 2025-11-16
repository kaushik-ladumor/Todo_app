import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { protect } from "../middleware/auth.js";
const router = Router();
// Zod schemas
const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
const forgotSchema = z.object({
    email: z.string().email()
});
const resetSchema = z.object({
    password: z.string().min(6)
});
// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
    try {
        const parsed = signupSchema.parse(req.body);
        const existing = await User.findOne({ email: parsed.email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashed = await bcrypt.hash(parsed.password, 10);
        const user = await User.create({
            name: parsed.name,
            email: parsed.email,
            password: hashed
        });
        const token = generateToken(String(user._id));
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/auth/login
router.post("/login", async (req, res, next) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const user = await User.findOne({ email: parsed.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(parsed.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(String(user._id));
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res, next) => {
    try {
        const parsed = forgotSchema.parse(req.body);
        const user = await User.findOne({ email: parsed.email });
        if (!user) {
            return res.json({ message: "If user exists, email is sent" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
        await user.save();
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            html: `<p>Click the link to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`
        });
        res.json({ message: "If user exists, email is sent" });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res, next) => {
    try {
        const parsed = resetSchema.parse(req.body);
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        user.password = await bcrypt.hash(parsed.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/auth/me
router.get("/me", protect, async (req, res, next) => {
    try {
        res.json({ user: req.user });
    }
    catch (error) {
        next(error);
    }
});
export default router;
