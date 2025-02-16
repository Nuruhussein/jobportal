import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoute from './routes/authRoute.js';
import jobRoute from './routes/jobRoute.js';
import applicationRoute from './routes/applicationRoute.js';
import userRoute from './routes/usersRoute.js';




dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

  app.use('/auth', authRoute);
  app.use('/jobs', jobRoute);
  app.use('/applications',applicationRoute );
  app.use('/users',userRoute );



// Routes
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
