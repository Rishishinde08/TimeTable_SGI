import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','viewer'], default: 'admin' }
}, { timestamps: true });
export default mongoose.model('User', userSchema);