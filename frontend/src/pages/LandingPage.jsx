import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Code2, Bot, FileText, BarChart3, Star, Github, Linkedin } from 'lucide-react';

const features = [
  { icon: FileText, title: 'Resume ATS Analyzer', desc: 'Upload your PDF resume and get an ATS score with actionable suggestions.', color: '#4d75ff' },
  { icon: Bot, title: 'AI Interview Questions', desc: 'Generate role-specific interview questions using Google Gemini AI.', color: '#00f5a0' },
  { icon: Bot, title: 'Mock Interview Chatbot', desc: 'Practice with an AI interviewer that gives real-time feedback.', color: '#ff6b6b' },
  { icon: Code2, title: 'Coding Test System', desc: 'MCQ tests with timer, scoring, and detailed results tracking.', color: '#ffa500' },
  { icon: BarChart3, title: 'Progress Analytics', desc: 'Visual dashboards tracking your improvement over time.', color: '#a855f7' },
  { icon: Star, title: 'Role-Based Access', desc: 'Secure JWT authentication with User and Admin roles.', color: '#f59e0b' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4d75ff,#00f5a0)' }}>
            <Zap size={18} color="white" />
          </div>
          <span className="font-display font-bold text-lg">AI Placement Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ color: 'rgba(240,240,248,0.7)' }}>Login</Link>
          <Link to="/register" className="btn-brand text-sm">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-24 px-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: '#4d75ff' }} />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: '#00f5a0' }} />
        </div>
        <div className="max-w-4xl mx-auto relative animate-slide-up">
          <div className="chip chip-blue mb-6 inline-flex">
            ✨ Powered by Google Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-6">
            Ace Your Next
            <br /><span className="gradient-text">Placement Interview</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(240,240,248,0.6)' }}>
            The all-in-one AI-powered platform for freshers and developers to prepare for campus placements —
            resume analysis, mock interviews, coding tests, and more.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-brand flex items-center gap-2 text-base px-8 py-3">
              Start Free <ArrowRight size={16} />
            </Link>
            <a href="https://github.com/udaygowda-cell" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm px-6 py-3 rounded-xl border font-medium transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,248,0.8)' }}>
              <Github size={16} /> View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold mb-3">Everything You Need</h2>
            <p style={{ color: 'rgba(240,240,248,0.5)' }}>Comprehensive tools to land your dream job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass p-6 hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,248,0.55)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4d75ff,#00f5a0)' }}>
            <Zap size={14} color="white" />
          </div>
          <span className="font-display font-bold">AI Placement Portal</span>
        </div>
        <p className="text-sm mb-4" style={{ color: 'rgba(240,240,248,0.4)' }}>
          Built by <strong className="text-white">Udaya Kumar K J</strong>
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://github.com/udaygowda-cell" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
            style={{ color: 'rgba(240,240,248,0.5)' }}>
            <Github size={14} /> udaygowda-cell
          </a>
          <a href="https://www.linkedin.com/in/udaya-kumar-k-j-26b120320" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
            style={{ color: 'rgba(240,240,248,0.5)' }}>
            <Linkedin size={14} /> Udaya Kumar K J
          </a>
        </div>
      </footer>
    </div>
  );
}
