import { Router } from 'express';
import Config from '../models/Config.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const r = Router();

r.get('/', async (_,res)=>{ const cfg = await Config.findOne().sort({createdAt:-1}); res.json({ ok:true, config: cfg }); });

r.post('/', requireAuth, requireAdmin, async (req,res)=>{
  // upsert latest config
  const cfg = await Config.findOne().sort({createdAt:-1});
  if(cfg){ Object.assign(cfg, req.body); await cfg.save(); return res.json({ ok:true, config: cfg }); }
  const created = await Config.create(req.body);
  res.json({ ok:true, config: created });
});

export default r;