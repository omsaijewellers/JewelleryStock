import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin, apiBase }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(`${apiBase}/auth/login`, form);
      onLogin(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4 text-center">OmSai Jewellers — Sign in</h2>
        <input className="w-full p-2 border mb-3 rounded" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})}/>
        <input type="password" className="w-full p-2 border mb-3 rounded" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <button className="w-full bg-yellow-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
