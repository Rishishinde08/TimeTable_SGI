import mongoose from 'mongoose';
const entrySchema = new mongoose.Schema({
  time: String,
  subject: String,
  type: String,
  break: String,
  note: String
},{ _id:false });
const ttSchema = new mongoose.Schema({
  version: { type: String, default: () => String(Date.now()) },
  data: { type: Map, of: [entrySchema] }
}, { timestamps: true });
export default mongoose.model('Timetable', ttSchema);