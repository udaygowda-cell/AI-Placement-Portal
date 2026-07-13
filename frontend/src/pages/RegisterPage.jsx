import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '',
    phone: '', college: '', branch: '', graduationYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ ...form, graduationYear: form.graduationYear ? parseInt(form.graduationYear) : null });
      toast.success('Account created! Welcome aboard 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, placeholder, type = 'text') => (
    <div>
      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(240,240,248,0.6)' }}>
        {label}
      </label>
      <input className={`form-input ${errors[name] ? 'border-red-500' : ''}`}
        type={type} placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })} />
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#4d75ff,#00f5a0)' }}>
            <Zap size={20} color="white" />
          </div>
          <span className="font-display font-bold text-xl text-white">AI Placement Portal</span>
        </div>

        <div className="glass p-8">
          <h2 className="font-display font-bold text-2xl text-white mb-1">Create Account</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(240,240,248,0.5)' }}>Start your placement journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('fullName', 'FULL NAME *', 'John Doe')}
              {field('username', 'USERNAME *', 'john_doe')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('email', 'EMAIL *', 'john@example.com', 'email')}
              {field('password', 'PASSWORD *', '6+ characters', 'password')}
            </div>
            {field('phone', 'PHONE', '+91 9999999999', 'tel')}
            <div className="grid grid-cols-2 gap-4">
              {field('college', 'COLLEGE', 'VTU University')}
              {field('branch', 'BRANCH', 'Computer Science')}
            </div>
            {field('graduationYear', 'GRADUATION YEAR', '2025', 'number')}

            <button type="submit" disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(240,240,248,0.5)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
