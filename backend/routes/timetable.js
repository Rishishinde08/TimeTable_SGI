import { Router } from 'express';
import { generateTimetable } from '../utils/generator.js';
import Timetable from '../models/Timetable.js';
import Config from '../models/Config.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = Router();

// Generate from explicit body (admin only)
r.post('/generate', requireAuth, requireAdmin, async (req,res)=>{
  try{
    const data = generateTimetable(req.body);
    const saved = await Timetable.create({ data });
    res.json({ ok:true, timetable: saved });
  }catch(e){ res.status(400).json({ ok:false, error:e.message }); }
});

// Generate from latest config (admin only)
r.post('/generate-from-config', requireAuth, requireAdmin, async (req,res)=>{
  try{
    const cfg = await Config.findOne().sort({createdAt:-1});
    if(!cfg) return res.status(400).json({ ok:false, error:'No config found' });
    const data = generateTimetable(cfg.toObject());
    const saved = await Timetable.create({ data });
    res.json({ ok:true, timetable: saved });
  }catch(e){ res.status(400).json({ ok:false, error:e.message }); }
});

// Public: latest timetable
r.get('/latest', async (_,res)=>{
  const last = await Timetable.findOne().sort({ createdAt: -1 });
  res.json({ ok:true, timetable: last });
});

export default r;