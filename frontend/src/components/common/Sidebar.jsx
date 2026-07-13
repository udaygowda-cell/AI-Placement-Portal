import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, MessageSquare, Bot, Code2,
  Shield, LogOut, User, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resume', icon: FileText, label: 'Resume ATS' },
  { to: '/interview', icon: MessageSquare, label: 'Interview Prep' },
  { to: '/chatbot', icon: Bot, label: 'Mock Interview' },
  { to: '/test', icon: Code2, label: 'Coding Tests' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 flex flex-col h-screen sticky top-0`}
      style={{ background: '#0d0d15', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4d75ff, #00f5a0)' }}>
          <Zap size={16} color="white" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-white text-sm leading-tight">
            AI Placement<br /><span className="text-brand-400">Portal</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            {!collapsed && <span className="text-sm">{label}</span>}
          </NavLink>
        ))}

        {isAdmin() && (
          <NavLink to="/admin"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Shield size={18} />
            {!collapsed && <span className="text-sm">Admin Panel</span>}
          </NavLink>
        )}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4d75ff, #00f5a0)' }}>
              {user?.fullName?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>{user?.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="sidebar-item w-full hover:!text-red-400 hover:!bg-red-500/10">
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-white z-10"
        style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)' }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
