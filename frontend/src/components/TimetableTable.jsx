import React, { useEffect, useState } from 'react';
import { TTApi } from '../services/api.js';
import './TimetableTable.css';

export default function TimetableTable() {
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    (async () => {
      const { timetable } = await TTApi.latest();
      if (!timetable?.data) { setRows([]); return; }
      const data = timetable.data;
      const d = Array.from(timetable.data ? Object.keys(data) : []);
      setDays(d);

      const times = new Set();
      d.forEach(day => data[day].forEach(x => times.add(x.time)));
      const ts = Array.from(times);
      setTimeSlots(ts);

      const r = ts.map(t => ({ time: t, cells: d.map(day => (data[day].find(x => x.time === t) || {})) }));
      setRows(r);
    })();
  }, []);

  if (!days.length) return <div className="no-timetable">No timetable generated yet.</div>;

  return (
    <div className="timetable-container">
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Time/Day</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.time}>
              <td className="font-semibold">{r.time}</td>
              {r.cells.map((c, i) => (
                <td key={i}>
                  {c.break ? <span className="italic">{c.break}</span> 
                  : c.subject ? <div>
                      <div className="font-semibold">{c.subject}</div>
                      <div className="text-xs">{c.type}</div>
                    </div> 
                  : c.note ? <span className="text-gray-500">{c.note}</span> 
                  : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
