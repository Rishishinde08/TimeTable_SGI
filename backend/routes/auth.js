import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
const r = Router();

r.post('/login', async (req,res)=>{
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  const token = jwt.sign({ id:user._id, email:user.email, role:user.role }, process.env.JWT_SECRET, { expiresIn:'7d' });
  res.json({ ok:true, token });
});

export default r;