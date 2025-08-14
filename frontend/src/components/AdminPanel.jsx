import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigApi, TTApi, setToken } from '../services/api.js';
import FieldArray from './FieldArray.jsx';
import './AdminPanel.css';

export default function AdminPanel(){
  const nav = useNavigate();
  const [token] = useState(localStorage.getItem('jwt')||'');
  const [days,setDays]=useState(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
  const [startTime,setStartTime]=useState('09:10');
  const [endTime,setEndTime]=useState('16:00');
  const [lectureDuration,setLectureDuration]=useState(60);
  const [breaks,setBreaks]=useState([{ time:'11:10', duration:10, label:'Short Break' }, { time:'13:20', duration:40, label:'Lunch' }]);
  const [offLectures,setOffLectures]=useState([]);
  const [subjects,setSubjects]=useState([
    { name:'TOC', type:'Theory', sessionsPerWeek:4 },
    { name:'DMS', type:'Theory', sessionsPerWeek:3 },
    { name:'SE',  type:'Theory', sessionsPerWeek:3 },
    { name:'HCI', type:'Theory', sessionsPerWeek:3 },
    { name:'BC',  type:'Theory', sessionsPerWeek:2 },
    { name:'Lab-1', type:'Lab', sessionsPerWeek:2, duration:120 }
  ]);
  const [noConsecutiveSame,setNoConsecutiveSame]=useState(true);
  const [status,setStatus]=useState('');

  useEffect(()=>{
    if(!token){ nav('/admin'); return; }
    setToken(token);
  },[]);

  async function saveConfig(e){ 
    e.preventDefault(); 
    setStatus('');
    try{
      const body={ days, startTime, endTime, lectureDuration, breaks, offLectures, subjects, noConsecutiveSame };
      await ConfigApi.save(body); 
      setStatus('Config saved.');
    }catch(e){ 
      setStatus(e.response?.data?.error||'Save failed'); 
    }
  }

  async function gen(){ 
    setStatus(''); 
    try{ 
      await TTApi.generateFromConfig(); 
      setStatus('Timetable generated.'); 
    }catch(e){ 
      setStatus(e.response?.data?.error||'Generation failed'); 
    } 
  }

  return (
    <form onSubmit={saveConfig} className="admin-form">
      <h1>Admin Panel</h1>

      <div className="grid-3">
        <input value={days.join(',')} onChange={e=>setDays(e.target.value.split(',').map(s=>s.trim()))} placeholder="Days (comma separated)"/>
        <input value={startTime} onChange={e=>setStartTime(e.target.value)} placeholder="Start HH:MM"/>
        <input value={endTime} onChange={e=>setEndTime(e.target.value)} placeholder="End HH:MM"/>
        <input type="number" value={lectureDuration} onChange={e=>setLectureDuration(Number(e.target.value))} placeholder="Lecture Duration (min)"/>
        <label className="checkbox-label">
          <input type="checkbox" checked={noConsecutiveSame} onChange={e=>setNoConsecutiveSame(e.target.checked)}/> No consecutive same
        </label>
      </div>

      <section>
        <h2>Breaks (incl. Lunch)</h2>
        <FieldArray items={breaks} setItems={setBreaks} schema={()=>({ time:'', duration:'', label:'' })}/>
      </section>

      <section>
        <h2>Off Lectures / Off Blocks</h2>
        <p>Example: day=Friday, time=14:00, duration=120, reason=Dept Meeting</p>
        <FieldArray items={offLectures} setItems={setOffLectures} schema={()=>({ day:'', time:'', duration:'', reason:'' })}/>
      </section>

      <section>
        <h2>Subjects & Labs</h2>
        <p>For Labs set type=Lab and optionally duration=120</p>
        <FieldArray items={subjects} setItems={setSubjects} schema={()=>({ name:'', type:'Theory', sessionsPerWeek:'', duration:'' })}/>
      </section>

      <div className="button-group">
        <button className="bg-black" type="submit">Save Config</button>
        <button className="border" type="button" onClick={gen}>Generate from Config</button>
        <span className="status-text">{status}</span>
      </div>
    </form>
  );
}
