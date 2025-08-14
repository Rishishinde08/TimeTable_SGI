import axios from 'axios';
// const api = axios.create({ baseURL: 'http://localhost:4000/api' });
const api = axios.create({ baseURL: 'https://timetable-sgi-1.onrender.com' });

export function setToken(t){ api.defaults.headers.common['Authorization'] = `Bearer ${t}`; }
export const Auth = { login: (email,password)=>api.post('/auth/login',{email,password}).then(r=>r.data) };
export const ConfigApi = {
  get: ()=>api.get('/config').then(r=>r.data),
  save: (body)=>api.post('/config', body).then(r=>r.data)
};
export const TTApi = {
  latest: ()=>api.get('/timetable/latest').then(r=>r.data),
  generate: (body)=>api.post('/timetable/generate', body).then(r=>r.data),
  generateFromConfig: ()=>api.post('/timetable/generate-from-config').then(r=>r.data)
};
export default api;