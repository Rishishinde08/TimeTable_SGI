const toMin = t=>{ const [h,m]=t.split(':').map(Number); return h*60+m; };
const fromMin = m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const addMin = (t,d)=>fromMin(toMin(t)+d);

function sortBreaks(breaks){ return [...(breaks||[])].sort((a,b)=>toMin(a.time)-toMin(b.time)); }

function buildDayGrid({ startTime, endTime, lectureDuration, breaks=[], offLectures=[] }){
  const grid=[]; const ordered=sortBreaks(breaks);
  let cur=toMin(startTime), end=toMin(endTime), bi=0;
  const offs = (offLectures||[]).sort((a,b)=>toMin(a.time)-toMin(b.time));
  let oi=0;
  while(cur<end){
    const nextBreak = ordered[bi]?toMin(ordered[bi].time):Infinity;
    const nextOff   = offs[oi]?toMin(offs[oi].time):Infinity;
    const nextSpecial = Math.min(nextBreak, nextOff);
    if(cur===nextSpecial){
      if(nextSpecial===nextBreak){
        const b = ordered[bi];
        grid.push({ kind:'break', start:fromMin(cur), end:fromMin(cur+b.duration), label:b.label||'Break' });
        cur += b.duration; bi++; continue;
      } else {
        const o = offs[oi];
        grid.push({ kind:'off', start:fromMin(cur), end:fromMin(cur+o.duration), label:o.reason||'Off' });
        cur += o.duration; oi++; continue;
      }
    }
    if(cur+lectureDuration>nextSpecial){
      if(cur<nextSpecial) grid.push({ kind:'gap', start:fromMin(cur), end:fromMin(nextSpecial) });
      cur = nextSpecial; continue;
    }
    const s=cur,e=cur+lectureDuration; grid.push({ kind:'slot', start:fromMin(s), end:fromMin(e), assignment:null }); cur=e;
  }
  return grid.filter(c=>!(c.kind==='gap' && c.start===c.end));
}

function gridFreeMin(grid){
  return grid.reduce((a,c)=>a+(c.kind==='slot' && !c.assignment ? toMin(c.end)-toMin(c.start):0),0);
}
function canFit(grid,i,dur,lastName){
  let need=dur; let k=i;
  for(;k<grid.length && need>0;k++){
    const cell=grid[k];
    if(cell.kind!=='slot' || cell.assignment) return null;
    need -= (toMin(cell.end)-toMin(cell.start));
  }
  if(need>0) return null; // ran out
  const endIndex=k-1;
  const left=grid[i-1], right=grid[endIndex+1];
  if((left&&left.assignment?.subject===lastName) || (right&&right.assignment?.subject===lastName)) return null;
  return { endIndex };
}
function assign(grid,i,endIndex,session){ for(let k=i;k<=endIndex;k++){ grid[k].assignment={ subject:session.name, type:session.type }; } }

export function generateTimetable(config){
  const { days, startTime, endTime, lectureDuration=60, breaks=[], subjects=[], offLectures=[], noConsecutiveSame=true } = config;
  if(!days?.length) throw new Error('days required');
  if(!startTime || !endTime) throw new Error('startTime/endTime required');
  const dayGrids={}; for(const d of days){ dayGrids[d]=buildDayGrid({ startTime,endTime,lectureDuration,breaks,offLectures:offLectures.filter(o=>o.day===d) }); }
  // expand sessions
  let sessions=[];
  subjects.forEach(s=>{
    const count=Math.max(1,s.sessionsPerWeek||1);
    const dur = s.duration || (s.type==='Lab'? 2*lectureDuration: lectureDuration);
    for(let i=0;i<count;i++) sessions.push({ name:s.name, type:s.type||'Theory', duration:dur });
  });
  // shuffle then sort by duration desc (labs first)
  for(let i=sessions.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [sessions[i],sessions[j]]=[sessions[j],sessions[i]]; }
  sessions.sort((a,b)=>b.duration-a.duration);

  const lastPerDay=Object.fromEntries(days.map(d=>[d,null]));
  for(const sess of sessions){
    let placed=false; const order=[...days].sort((a,b)=>gridFreeMin(dayGrids[b])-gridFreeMin(dayGrids[a]));
    for(const d of order){
      const grid=dayGrids[d];
      for(let i=0;i<grid.length;i++){
        if(grid[i].kind!=='slot' || grid[i].assignment) continue;
        if(noConsecutiveSame && lastPerDay[d]===sess.name) continue;
        const fit=canFit(grid,i,sess.duration,lastPerDay[d]);
        if(fit){ assign(grid,i,fit.endIndex,sess); lastPerDay[d]=sess.name; placed=true; break; }
      }
      if(placed) break;
    }
    if(!placed) throw new Error(`Cannot place session ${sess.name} (${sess.duration}m)`);
  }
  const out={};
  for(const d of days){
    out[d]=dayGrids[d].map(c=>{
      const time=`${c.start}-${c.end}`;
      if(c.kind==='break') return { time, break:c.label };
      if(c.kind==='off')   return { time, note:c.label };
      if(c.kind==='slot' && c.assignment) return { time, subject:c.assignment.subject, type:c.assignment.type };
      if(c.kind==='slot') return { time, subject:null };
      return { time, note:'Gap' };
    });
  }
  return out;
}