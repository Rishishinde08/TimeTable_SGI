import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'mern_timetable' });
const email = process.env.ADMIN_EMAIL; const pass = process.env.ADMIN_PASSWORD;
const hash = await bcrypt.hash(pass, 10);
const existing = await User.findOne({ email });
if(existing){ existing.passwordHash = hash; await existing.save(); console.log('Admin updated'); }
else { await User.create({ email, passwordHash: hash, role: 'admin' }); console.log('Admin created'); }
await mongoose.disconnect();