import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import storyRoutes from './routes/storyRoutes';
import academyRoutes from './routes/academyRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes); // Grouped profile, referrals, etc. under /api/user

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
