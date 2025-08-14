import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import configRoutes from './routes/config.js';
import timetableRoutes from './routes/timetable.js';

const app = express();
app.use(express.json());
// app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://time-table-sgi.vercel.app"
  ],
  credentials: true
}));


mongoose.connect(process.env.MONGODB_URI, { dbName: 'mern_timetable' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error', err); process.exit(1); });

app.get('/', (_, res) => res.send('Timetable API running'));
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/timetable', timetableRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));