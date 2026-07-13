import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.usernameOrEmail.trim()) e.usernameOrEmail = 'Required';
    if (!form.password) e.password = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#4d75ff,#00f5a0)' }}>
            <Zap size={20} color="white" />
          </div>
          <span className="font-display font-bold text-xl text-white">AI Placement Portal</span>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="font-display font-bold text-2xl text-white mb-1">Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(240,240,248,0.5)' }}>Sign in to continue your preparation</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(240,240,248,0.6)' }}>
                USERNAME OR EMAIL
              </label>
              <input className={`form-input ${errors.usernameOrEmail ? 'border-red-500' : ''}`}
                placeholder="john_doe or john@example.com"
                value={form.usernameOrEmail}
                onChange={e => setForm({ ...form, usernameOrEmail: e.target.value })} />
              {errors.usernameOrEmail && <p className="text-xs text-red-400 mt-1">{errors.usernameOrEmail}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(240,240,248,0.6)' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(240,240,248,0.4)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-lg text-xs" style={{ background: 'rgba(77,117,255,0.08)', border: '1px solid rgba(77,117,255,0.2)' }}>
            <p className="text-brand-400 font-semibold mb-1">Demo Credentials</p>
            <p style={{ color: 'rgba(240,240,248,0.6)' }}>Admin: <span className="text-white">udayakumar / admin123</span></p>
            <p style={{ color: 'rgba(240,240,248,0.6)' }}>User: <span className="text-white">testuser / user123</span></p>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(240,240,248,0.5)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
