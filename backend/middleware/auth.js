import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({ ok:false, error:'Missing token' });
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {id,email,role}
    next();
  }catch(e){
    res.status(401).json({ ok:false, error:'Invalid token' });
  }
}
export function requireAdmin(req, res, next){
  if(req.user?.role !== 'admin') return res.status(403).json({ ok:false, error:'Admin only' });
  next();
}