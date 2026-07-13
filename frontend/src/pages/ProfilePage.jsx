import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import { dashboardService, testService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, GraduationCap, Building, Trophy, Code2, BarChart2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    dashboardService.getStats().then(r => setStats(r.data.data)).catch(() => {});
    testService.getMyResults().then(r => setResults(r.data.data || [])).catch(() => {});
  }, []);

  const catColor = { JAVA: '#4d75ff', REACT: '#00f5a0', SQL: '#ffa500', HR: '#a855f7', DSA: '#ff6b6b' };

  return (
    <Layout title="My Profile" subtitle="Your account information and performance history">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile card */}
        <div className="glass p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-black text-white mb-4"
            style={{ background: 'linear-gradient(135deg,#4d75ff,#00f5a0)' }}>
            {user?.fullName?.[0] || 'U'}
          </div>
          <h2 className="font-display font-bold text-xl text-white">{user?.fullName}</h2>
          <p className="text-sm mb-1" style={{ color: 'rgba(240,240,248,0.5)' }}>@{user?.username}</p>
          <span className={`chip mt-2 ${user?.role === 'ADMIN' ? 'chip-orange' : 'chip-blue'}`}>{user?.role}</span>

          <div className="w-full mt-6 space-y-3">
            {[
              { icon: Mail, label: user?.email },
              { icon: Phone, label: stats?.phone || 'Not set' },
              { icon: Building, label: stats?.college || 'Not set' },
              { icon: GraduationCap, label: stats?.branch || 'Not set' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm py-2.5 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Icon size={15} style={{ color: 'rgba(240,240,248,0.4)' }} />
                <span style={{ color: 'rgba(240,240,248,0.7)' }} className="truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + Results */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Code2, label: 'Tests Taken', value: stats?.totalTests || 0, color: '#4d75ff' },
              { icon: Trophy, label: 'Avg Score', value: `${stats?.averageScore || 0}%`, color: '#00f5a0' },
              { icon: BarChart2, label: 'Resumes', value: stats?.totalResumes || 0, color: '#ffa500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass p-4 text-center">
                <Icon size={20} className="mx-auto mb-2" style={{ color }} />
                <p className="text-2xl font-display font-black text-white">{value}</p>
                <p className="text-xs" style={{ color: 'rgba(240,240,248,0.5)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Test history */}
          <div className="glass p-5">
            <h3 className="font-display font-bold text-white mb-4">Test History</h3>
            {results.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: 'rgba(240,240,248,0.35)' }}>No tests taken yet</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {results.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: `${catColor[r.category] || '#4d75ff'}18`, color: catColor[r.category] || '#4d75ff' }}>
                        {r.category?.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{r.category} — {r.difficulty}</p>
                        <p className="text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>
                          {r.correctAnswers}/{r.totalQuestions} correct · {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-black text-lg"
                        style={{ color: r.score >= 70 ? '#00f5a0' : r.score >= 50 ? '#ffa500' : '#ff5050' }}>
                        {r.score}%
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(240,240,248,0.35)' }}>
                        {new Date(r.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
