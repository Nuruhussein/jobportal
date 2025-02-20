import express from 'express';
import Job from '../models/Job.js';
import { authMiddleware, adminOrEmployerMiddleware } from '../middleware/auth.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
// import { authMiddleware, adminOrEmployerMiddleware } from '../middleware/auth.js';
const router = express.Router();
router.post("/", authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        console.log("Received data:", req.body); // Debugging
        const { name, email, password, role, department } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role, department });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { role } = req.query;
        const users = role ? await User.find({ role }) : await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;