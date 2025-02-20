import express from 'express';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if password length is greater than 3
  if (!password || password.length <= 3) {
      return res.status(400).json({ message: 'Password must be longer than 3 characters' });
  }

  // Check if email format is valid
  if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword, role, department });

      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});


// Token verification endpoint
router.get("/verify", authMiddleware, async (req, res) => {
    try {
      const existingUserId = req.user.id; // Extract user ID from the middleware
      const user = await User.findById(existingUserId).lean(); // Use lean to get a plain object
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({
        user, // Send the user object
        isAuthenticated: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
export default router;
