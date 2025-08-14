import mongoose from 'mongoose';
const configSchema = new mongoose.Schema({
  days: { type: [String], default: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
  startTime: { type: String, required: true }, // HH:MM
  endTime:   { type: String, required: true },
  lectureDuration: { type: Number, default: 60 },
  breaks: [{ time: String, duration: Number, label: String }],
  offLectures: [{ day: String, time: String, duration: Number, reason: String }],
  subjects: [{
    name: String,
    type: { type: String, enum: ['Theory','Lab'], default: 'Theory' },
    sessionsPerWeek: { type: Number, default: 1 },
    duration: Number // if absent, Theory=lectureDuration, Lab=2*lectureDuration
  }],
  noConsecutiveSame: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Config', configSchema);