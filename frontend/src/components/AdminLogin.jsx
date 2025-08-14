import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth, setToken } from '../services/api.js';
import './AdminLogin.css';

export default function AdminLogin({ onToken }) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { token } = await Auth.login(email, password);
      setToken(token);
      onToken?.(token);
      nav('/admin/panel');
    } catch(e) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="form-container">
      <h1>Admin Login</h1>
      <input 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      {err && <div className="error">{err}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
