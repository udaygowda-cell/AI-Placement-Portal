import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { interviewService } from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, ChevronDown, ChevronUp, Loader2, Lightbulb } from 'lucide-react';

const CATEGORIES = ['JAVA', 'REACT', 'SQL', 'HR', 'DSA', 'PYTHON'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const COUNTS = [5, 10, 15, 20];

const diffColor = { EASY: 'chip-green', MEDIUM: 'chip-orange', HARD: 'chip-red' };
const catColor = {
  JAVA: '#4d75ff', REACT: '#00f5a0', SQL: '#ffa500',
  HR: '#a855f7', DSA: '#ff6b6b', PYTHON: '#f59e0b'
};

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(77,117,255,0.15)', color: '#4d75ff' }}>
          {index + 1}
        </span>
        <p className="flex-1 text-white text-sm leading-relaxed font-medium">{q.question}</p>
        <div className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(240,240,248,0.3)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="mt-4 p-4 rounded-xl text-sm leading-relaxed"
            style={{ background: 'rgba(0,245,160,0.06)', border: '1px solid rgba(0,245,160,0.15)', color: 'rgba(240,240,248,0.8)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#00f5a0' }}>💡 ANSWER</p>
            {q.answer}
          </div>
          {q.tip && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.15)' }}>
              <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#ffa500' }} />
              <p className="text-xs" style={{ color: 'rgba(240,240,248,0.65)' }}><strong style={{ color: '#ffa500' }}>Pro Tip: </strong>{q.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const [category, setCategory] = useState('JAVA');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);
    try {
      const res = await interviewService.generateQuestions(category, difficulty, count);
      const raw = res.data.data;
      // Parse JSON from AI response
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setQuestions(parsed);
        toast.success(`Generated ${parsed.length} questions! 🎯`);
      } else {
        toast.error('Could not parse AI response. Check your Gemini API key.');
      }
    } catch (err) {
      toast.error('Failed to generate questions. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Interview Question Generator"
      subtitle="Generate tailored interview questions using Google Gemini AI">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass p-5">
            <h3 className="font-display font-bold text-white mb-4">Configure</h3>

            {/* Category */}
            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(240,240,248,0.5)' }}>CATEGORY</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className="py-2 px-3 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: category === c ? `${catColor[c]}20` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${category === c ? catColor[c] + '50' : 'rgba(255,255,255,0.06)'}`,
                      color: category === c ? catColor[c] : 'rgba(240,240,248,0.5)',
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(240,240,248,0.5)' }}>DIFFICULTY</label>
              <div className="space-y-2">
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all text-left"
                    style={{
                      background: difficulty === d ? 'rgba(77,117,255,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${difficulty === d ? 'rgba(77,117,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: difficulty === d ? '#4d75ff' : 'rgba(240,240,248,0.5)',
                    }}>
                    {d === 'EASY' ? '🟢' : d === 'MEDIUM' ? '🟡' : '🔴'} {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="mb-5">
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(240,240,248,0.5)' }}>NUMBER OF QUESTIONS</label>
              <div className="grid grid-cols-4 gap-1">
                {COUNTS.map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    className="py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: count === n ? 'rgba(77,117,255,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${count === n ? 'rgba(77,117,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: count === n ? '#4d75ff' : 'rgba(240,240,248,0.5)',
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2">
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <Sparkles size={16} />}
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>

          {/* Info card */}
          <div className="glass p-4">
            <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(240,240,248,0.5)' }}>HOW IT WORKS</p>
            <ul className="space-y-2 text-xs" style={{ color: 'rgba(240,240,248,0.55)' }}>
              <li>1. Select topic & difficulty</li>
              <li>2. Click Generate</li>
              <li>3. Read question, click to reveal answer</li>
              <li>4. Practice answering out loud</li>
            </ul>
          </div>
        </div>

        {/* Questions Panel */}
        <div className="lg:col-span-3">
          {!loading && questions.length === 0 && (
            <div className="glass flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(77,117,255,0.1)', border: '1px solid rgba(77,117,255,0.2)' }}>
                <Sparkles size={28} style={{ color: '#4d75ff' }} />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Ready to Generate!</h3>
              <p className="text-sm max-w-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>
                Configure your preferences on the left and click Generate to get AI-powered interview questions.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={40} className="animate-spin" style={{ color: '#4d75ff' }} />
              <p className="font-display font-bold text-white">Generating {count} {difficulty} {category} questions...</p>
              <p className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>Powered by Google Gemini AI</p>
            </div>
          )}

          {!loading && questions.length > 0 && (
            <div className="space-y-3 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: 'rgba(240,240,248,0.6)' }}>
                  {questions.length} questions · {category} · <span className={`chip ${diffColor[difficulty]}`}>{difficulty}</span>
                </p>
                <button onClick={generate} className="text-xs text-brand-400 hover:underline">Regenerate</button>
              </div>
              {questions.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
