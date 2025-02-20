import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import authRoute from './routes/authRoute.js';
import jobRoute from './routes/jobRoute.js';
import applicationRoute from './routes/applicationRoute.js';
import userRoute from './routes/usersRoute.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();



dotenv.config();


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));


// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use('/auth', authRoute);
  app.use('/jobs', jobRoute);
  app.use('/applications',applicationRoute );
  app.use('/users',userRoute );



// Routes
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
