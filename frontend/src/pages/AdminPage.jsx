import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import { adminService } from '../services/api';
import toast from 'react-hot-toast';
import { Users, Code2, FileText, BarChart2, Trash2, Plus, X, Save, AlertTriangle } from 'lucide-react';

const TAB_LABELS = ['Overview', 'Users', 'Questions', 'Resumes', 'Results'];

const StatBox = ({ icon: Icon, label, value, color }) => (
  <div className="glass p-5">
    <div className="flex items-center gap-3 mb-2">
      <Icon size={18} style={{ color }} />
      <p className="text-sm font-semibold" style={{ color: 'rgba(240,240,248,0.6)' }}>{label}</p>
    </div>
    <p className="text-3xl font-display font-black text-white">{value ?? '—'}</p>
  </div>
);

const EMPTY_Q = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', category: 'JAVA', difficulty: 'EASY' };

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [showQForm, setShowQForm] = useState(false);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (tab === 0) adminService.getStats().then(r => setStats(r.data.data)).catch(() => {});
    if (tab === 1) adminService.getUsers().then(r => setUsers(r.data.data || [])).catch(() => {});
    if (tab === 2) adminService.getQuestions().then(r => setQuestions(r.data.data || [])).catch(() => {});
    if (tab === 3) adminService.getResumes().then(r => setResumes(r.data.data || [])).catch(() => {});
    if (tab === 4) adminService.getResults().then(r => setResults(r.data.data || [])).catch(() => {});
  }, [tab]);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminService.deleteUser(id);
    setUsers(u => u.filter(x => x.id !== id));
    toast.success('User deleted');
  };

  const saveQuestion = async () => {
    try {
      if (editId) {
        const res = await adminService.updateQuestion(editId, qForm);
        setQuestions(q => q.map(x => x.id === editId ? res.data.data : x));
        toast.success('Question updated');
      } else {
        const res = await adminService.addQuestion(qForm);
        setQuestions(q => [res.data.data, ...q]);
        toast.success('Question added');
      }
      setShowQForm(false); setQForm(EMPTY_Q); setEditId(null);
    } catch { toast.error('Failed to save question'); }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await adminService.deleteQuestion(id);
    setQuestions(q => q.filter(x => x.id !== id));
    toast.success('Question deleted');
  };

  const editQuestion = (q) => {
    setQForm({ ...q }); setEditId(q.id); setShowQForm(true);
  };

  const catColor = { JAVA: '#4d75ff', REACT: '#00f5a0', SQL: '#ffa500', HR: '#a855f7', DSA: '#ff6b6b' };

  return (
    <Layout title="Admin Panel" subtitle="Manage users, questions, and monitor platform activity">
      {/* Admin warning */}
      <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm"
        style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <AlertTriangle size={16} style={{ color: '#ffa500' }} />
        <span style={{ color: 'rgba(240,240,248,0.7)' }}>You have administrator privileges. Actions here affect all users.</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {TAB_LABELS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: tab === i ? 'rgba(77,117,255,0.2)' : 'transparent',
              color: tab === i ? '#4d75ff' : 'rgba(240,240,248,0.5)',
            }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <StatBox icon={Users} label="Total Users" value={stats?.totalUsers} color="#4d75ff" />
          <StatBox icon={Code2} label="Questions" value={stats?.totalQuestions} color="#00f5a0" />
          <StatBox icon={BarChart2} label="Tests Completed" value={stats?.totalTests} color="#ffa500" />
          <StatBox icon={FileText} label="Resumes Uploaded" value={stats?.totalResumes} color="#a855f7" />
          <div className="glass p-5 col-span-2 lg:col-span-4">
            <p className="text-sm" style={{ color: 'rgba(240,240,248,0.5)' }}>Platform Average Score</p>
            <p className="text-4xl font-display font-black text-white mt-1">
              {stats?.averagePlatformScore ? Math.round(stats.averagePlatformScore) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 1 && (
        <div className="glass overflow-hidden animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['ID', 'Name', 'Email', 'Role', 'College', 'Active', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold"
                    style={{ color: 'rgba(240,240,248,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>#{u.id}</td>
                  <td className="px-4 py-3 font-semibold text-white">{u.fullName}</td>
                  <td className="px-4 py-3" style={{ color: 'rgba(240,240,248,0.6)' }}>{u.email}</td>
                  <td className="px-4 py-3"><span className={`chip ${u.role === 'ADMIN' ? 'chip-orange' : 'chip-blue'}`}>{u.role}</span></td>
                  <td className="px-4 py-3" style={{ color: 'rgba(240,240,248,0.5)' }}>{u.college || '—'}</td>
                  <td className="px-4 py-3"><span className={`chip ${u.isActive ? 'chip-green' : 'chip-red'}`}>{u.isActive ? 'Yes' : 'No'}</span></td>
                  <td className="px-4 py-3">
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: '#ff5050' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QUESTIONS */}
      {tab === 2 && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowQForm(true); setQForm(EMPTY_Q); setEditId(null); }}
              className="btn-brand flex items-center gap-2">
              <Plus size={15} /> Add Question
            </button>
          </div>

          {/* Add/Edit form */}
          {showQForm && (
            <div className="glass p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white">{editId ? 'Edit' : 'Add'} Question</h3>
                <button onClick={() => setShowQForm(false)} style={{ color: 'rgba(240,240,248,0.4)' }}><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <textarea className="form-input" rows={3} placeholder="Question text"
                  value={qForm.questionText} onChange={e => setQForm({ ...qForm, questionText: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map(k => (
                    <input key={k} className="form-input" placeholder={`Option ${k}`}
                      value={qForm[`option${k}`]}
                      onChange={e => setQForm({ ...qForm, [`option${k}`]: e.target.value })} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <select className="form-input" value={qForm.correctAnswer} onChange={e => setQForm({ ...qForm, correctAnswer: e.target.value })}>
                    {['A', 'B', 'C', 'D'].map(k => <option key={k} value={k}>Correct: {k}</option>)}
                  </select>
                  <select className="form-input" value={qForm.category} onChange={e => setQForm({ ...qForm, category: e.target.value })}>
                    {['JAVA', 'REACT', 'SQL', 'HR', 'DSA', 'PYTHON', 'GENERAL'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select className="form-input" value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })}>
                    {['EASY', 'MEDIUM', 'HARD'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <textarea className="form-input" rows={2} placeholder="Explanation (optional)"
                  value={qForm.explanation} onChange={e => setQForm({ ...qForm, explanation: e.target.value })} />
                <button onClick={saveQuestion} className="btn-brand flex items-center gap-2">
                  <Save size={15} /> Save Question
                </button>
              </div>
            </div>
          )}

          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['#', 'Question', 'Category', 'Difficulty', 'Answer', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: 'rgba(240,240,248,0.4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'rgba(240,240,248,0.3)' }}>{i + 1}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-white text-xs line-clamp-2">{q.questionText}</p>
                    </td>
                    <td className="px-4 py-3"><span className="chip chip-blue">{q.category}</span></td>
                    <td className="px-4 py-3"><span className={`chip ${q.difficulty === 'EASY' ? 'chip-green' : q.difficulty === 'MEDIUM' ? 'chip-orange' : 'chip-red'}`}>{q.difficulty}</span></td>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: '#00f5a0' }}>{q.correctAnswer}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => editQuestion(q)} className="text-xs px-2 py-1 rounded-lg font-semibold transition-colors"
                        style={{ background: 'rgba(77,117,255,0.15)', color: '#4d75ff' }}>Edit</button>
                      <button onClick={() => deleteQuestion(q.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: '#ff5050' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {questions.length === 0 && (
              <p className="text-center py-8 text-sm" style={{ color: 'rgba(240,240,248,0.35)' }}>No questions yet. Add your first question!</p>
            )}
          </div>
        </div>
      )}

      {/* RESUMES */}
      {tab === 3 && (
        <div className="glass animate-fade-in overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['User', 'File', 'ATS Score', 'Skills', 'Uploaded'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: 'rgba(240,240,248,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resumes.map(r => (
                <tr key={r.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-semibold text-white">User #{r.user?.id}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(240,240,248,0.6)' }}>{r.fileName}</td>
                  <td className="px-4 py-3"><span className={`chip ${r.atsScore >= 70 ? 'chip-green' : r.atsScore >= 50 ? 'chip-orange' : 'chip-red'}`}>{r.atsScore}%</span></td>
                  <td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color: 'rgba(240,240,248,0.5)' }}>{r.skills}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>{new Date(r.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {resumes.length === 0 && <p className="text-center py-8 text-sm" style={{ color: 'rgba(240,240,248,0.35)' }}>No resumes uploaded yet</p>}
        </div>
      )}

      {/* RESULTS */}
      {tab === 4 && (
        <div className="glass animate-fade-in overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['User', 'Category', 'Difficulty', 'Score', 'Correct', 'Time', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: 'rgba(240,240,248,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 font-semibold text-white">User #{r.user?.id}</td>
                  <td className="px-4 py-3"><span className="chip chip-blue">{r.category}</span></td>
                  <td className="px-4 py-3"><span className={`chip ${r.difficulty === 'EASY' ? 'chip-green' : r.difficulty === 'MEDIUM' ? 'chip-orange' : 'chip-red'}`}>{r.difficulty}</span></td>
                  <td className="px-4 py-3 font-bold" style={{ color: r.score >= 70 ? '#00f5a0' : r.score >= 50 ? '#ffa500' : '#ff5050' }}>{r.score}%</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(240,240,248,0.6)' }}>{r.correctAnswers}/{r.totalQuestions}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(240,240,248,0.5)' }}>{Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>{new Date(r.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && <p className="text-center py-8 text-sm" style={{ color: 'rgba(240,240,248,0.35)' }}>No results yet</p>}
        </div>
      )}
    </Layout>
  );
}
