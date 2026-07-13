import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { Trophy, FileText, Code2, TrendingUp, Star, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="glass p-6 flex items-start gap-4 hover:scale-[1.02] transition-transform">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-3xl font-display font-black text-white">{value}</p>
      <p className="text-sm font-semibold" style={{ color: 'rgba(240,240,248,0.7)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,248,0.35)' }}>{sub}</p>}
    </div>
  </div>
);

const difficultyColor = { EASY: '#00f5a0', MEDIUM: '#ffa500', HARD: '#ff5050' };
const categoryColor = { JAVA: '#4d75ff', REACT: '#00f5a0', SQL: '#ffa500', HR: '#a855f7', DSA: '#ff6b6b' };

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  // Prepare chart data
  const recentTests = stats?.recentTests || [];
  const barData = recentTests.map((t, i) => ({
    name: `${t.category?.slice(0,3)} ${i + 1}`,
    score: t.score,
    fill: categoryColor[t.category] || '#4d75ff'
  }));

  const radialData = [
    { name: 'Avg Score', value: stats?.averageScore || 0, fill: '#4d75ff' },
    { name: 'Tests', value: Math.min((stats?.totalTests || 0) * 10, 100), fill: '#00f5a0' },
    { name: 'Resumes', value: Math.min((stats?.totalResumes || 0) * 25, 100), fill: '#ffa500' },
  ];

  const quickActions = [
    { label: 'Upload Resume', to: '/resume', color: '#4d75ff', icon: FileText },
    { label: 'Practice Interview', to: '/interview', color: '#00f5a0', icon: Star },
    { label: 'Mock Interview', to: '/chatbot', color: '#a855f7', icon: TrendingUp },
    { label: 'Take a Test', to: '/test', color: '#ff6b6b', icon: Code2 },
  ];

  return (
    <Layout title={`Welcome back, ${stats?.fullName?.split(' ')[0] || user?.fullName?.split(' ')[0]} 👋`}
      subtitle="Here's your placement preparation overview">

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
        <StatCard icon={Code2} label="Tests Taken" value={stats?.totalTests || 0}
          sub="Total attempts" color="#4d75ff" />
        <StatCard icon={Trophy} label="Average Score" value={`${stats?.averageScore || 0}%`}
          sub="Across all tests" color="#00f5a0" />
        <StatCard icon={FileText} label="Resumes Uploaded" value={stats?.totalResumes || 0}
          sub="With ATS analysis" color="#ffa500" />
        <StatCard icon={TrendingUp} label="Progress" value={
          stats?.averageScore >= 80 ? 'Excellent' :
          stats?.averageScore >= 60 ? 'Good' :
          stats?.averageScore >= 40 ? 'Improving' : 'Start!'
        } sub="Overall performance" color="#a855f7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Bar Chart */}
        <div className="glass p-6 lg:col-span-2">
          <h3 className="font-display font-bold text-white mb-4">Recent Test Scores</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(240,240,248,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(240,240,248,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f0f0f8' }}
                  formatter={(v) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#4d75ff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center gap-3">
              <Code2 size={36} style={{ color: 'rgba(240,240,248,0.2)' }} />
              <p style={{ color: 'rgba(240,240,248,0.4)' }} className="text-sm">No test results yet</p>
              <Link to="/test" className="btn-brand text-sm px-4 py-2">Take Your First Test</Link>
            </div>
          )}
        </div>

        {/* Progress Rings */}
        <div className="glass p-6">
          <h3 className="font-display font-bold text-white mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="value" cornerRadius={6} />
              <Legend iconSize={10} iconType="circle" layout="horizontal" verticalAlign="bottom"
                formatter={(v) => <span style={{ color: 'rgba(240,240,248,0.6)', fontSize: 11 }}>{v}</span>} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass p-6">
          <h3 className="font-display font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, to, color, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                <Icon size={18} style={{ color }} />
                <span className="text-sm font-medium text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white">Recent Tests</h3>
            <Link to="/test" className="text-xs text-brand-400 flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.slice(0, 4).map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: `${categoryColor[t.category] || '#4d75ff'}18`, color: categoryColor[t.category] || '#4d75ff' }}>
                      {t.category?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.category}</p>
                      <p className="text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>
                        {t.correctAnswers}/{t.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: t.score >= 70 ? '#00f5a0' : t.score >= 50 ? '#ffa500' : '#ff5050' }}>
                      {t.score}%
                    </p>
                    <span className={`chip text-xs ${difficultyColor[t.difficulty] === '#00f5a0' ? 'chip-green' : t.difficulty === 'MEDIUM' ? 'chip-orange' : 'chip-red'}`}>
                      {t.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Calendar size={28} style={{ color: 'rgba(240,240,248,0.2)' }} />
              <p className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>No tests taken yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
