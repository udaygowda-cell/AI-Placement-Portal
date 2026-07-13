import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/common/Layout';
import { testService } from '../services/api';
import toast from 'react-hot-toast';
import { Timer, CheckCircle, XCircle, Trophy, RotateCcw, Play, ChevronRight, ChevronLeft } from 'lucide-react';

const CATEGORIES = ['JAVA', 'REACT', 'SQL', 'HR', 'DSA'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

const diffStyle = { EASY: 'chip-green', MEDIUM: 'chip-orange', HARD: 'chip-red' };

function Timer_({ seconds }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  const danger = seconds < 60;
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg"
      style={{
        background: danger ? 'rgba(255,80,80,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${danger ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
        color: danger ? '#ff5050' : '#f0f0f8',
        animation: danger ? 'pulse 1s infinite' : 'none'
      }}>
      <Timer size={16} />
      {m}:{s}
    </div>
  );
}

function ResultView({ questions, answers, timeTaken, onRetry, score }) {
  return (
    <div className="max-w-2xl mx-auto text-center animate-slide-up">
      {/* Score circle */}
      <div className="mb-8">
        <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto mb-4"
          style={{
            background: `conic-gradient(${score >= 70 ? '#00f5a0' : score >= 50 ? '#ffa500' : '#ff5050'} ${score * 3.6}deg, rgba(255,255,255,0.06) 0)`,
            padding: 4
          }}>
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center"
            style={{ background: '#111118' }}>
            <Trophy size={24} style={{ color: score >= 70 ? '#00f5a0' : score >= 50 ? '#ffa500' : '#ff5050' }} className="mb-1" />
            <span className="text-3xl font-display font-black text-white">{score}%</span>
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-1">
          {score >= 80 ? '🎉 Excellent!' : score >= 60 ? '👍 Good Job!' : score >= 40 ? '📚 Keep Practicing' : '💪 Never Give Up!'}
        </h2>
        <p style={{ color: 'rgba(240,240,248,0.5)' }}>
          {questions.filter((_, i) => answers[i] === questions[i].correctAnswer).length} / {questions.length} correct
          · {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
        </p>
      </div>

      {/* Per-question review */}
      <div className="space-y-3 text-left mb-8">
        {questions.map((q, i) => {
          const correct = answers[i] === q.correctAnswer;
          return (
            <div key={q.id} className="glass p-4" style={{ borderColor: correct ? 'rgba(0,245,160,0.15)' : 'rgba(255,80,80,0.15)' }}>
              <div className="flex items-start gap-3">
                {correct
                  ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#00f5a0' }} />
                  : <XCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ff5050' }} />}
                <div className="flex-1">
                  <p className="text-sm text-white font-medium mb-2">{q.questionText}</p>
                  {!correct && (
                    <div className="space-y-1 text-xs">
                      <p style={{ color: '#ff5050' }}>Your answer: Option {answers[i] || 'Skipped'}</p>
                      <p style={{ color: '#00f5a0' }}>Correct answer: Option {q.correctAnswer}</p>
                    </div>
                  )}
                  {q.explanation && (
                    <p className="text-xs mt-2" style={{ color: 'rgba(240,240,248,0.45)' }}>{q.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onRetry} className="btn-brand flex items-center gap-2 mx-auto">
        <RotateCcw size={16} /> Take Another Test
      </button>
    </div>
  );
}

export default function TestPage() {
  const [phase, setPhase] = useState('config'); // config | test | result
  const [category, setCategory] = useState('JAVA');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(600);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loadingQ, setLoadingQ] = useState(false);
  const [score, setScore] = useState(0);
  const startTime = React.useRef(0);

  // Timer
  useEffect(() => {
    if (phase !== 'test') return;
    if (seconds <= 0) handleSubmit();
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, seconds]);

  const startTest = async () => {
    setLoadingQ(true);
    try {
      const res = await testService.getQuestions(category, difficulty, 10);
      const qs = res.data.data;
      if (!qs?.length) { toast.error('No questions found. Add questions via Admin panel.'); return; }
      setQuestions(qs);
      setAnswers({});
      setCurrent(0);
      setSeconds(qs.length * 60); // 1 min per question
      startTime.current = Date.now();
      setPhase('test');
    } catch {
      toast.error('Failed to load questions. Is the backend running?');
    } finally {
      setLoadingQ(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
    setTimeTaken(elapsed);
    const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const sc = Math.round((correct / questions.length) * 100);
    setScore(sc);

    try {
      await testService.submitTest({
        category, difficulty,
        totalQuestions: questions.length,
        correctAnswers: correct,
        timeTaken: elapsed,
        answersJson: JSON.stringify(answers)
      });
      toast.success('Test submitted! 🎯');
    } catch { /* score still shows */ }
    setPhase('result');
  }, [questions, answers, category, difficulty]);

  const q = questions[current];
  const opts = q ? ['A', 'B', 'C', 'D'].map((k, i) => ({ key: k, text: [q.optionA, q.optionB, q.optionC, q.optionD][i] })) : [];

  if (phase === 'config') return (
    <Layout title="Coding Tests" subtitle="MCQ-based tests with timer, auto-scoring, and result tracking">
      <div className="max-w-lg mx-auto animate-slide-up">
        <div className="glass p-8 space-y-6">
          <div>
            <label className="text-xs font-semibold mb-3 block" style={{ color: 'rgba(240,240,248,0.5)' }}>SELECT CATEGORY</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: category === c ? 'rgba(77,117,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${category === c ? 'rgba(77,117,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: category === c ? '#4d75ff' : 'rgba(240,240,248,0.5)',
                  }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-3 block" style={{ color: 'rgba(240,240,248,0.5)' }}>DIFFICULTY LEVEL</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: difficulty === d ? 'rgba(77,117,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${difficulty === d ? 'rgba(77,117,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: difficulty === d ? '#4d75ff' : 'rgba(240,240,248,0.5)',
                  }}>
                  {d === 'EASY' ? '🟢' : d === 'MEDIUM' ? '🟡' : '🔴'} {d}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(77,117,255,0.07)', border: '1px solid rgba(77,117,255,0.15)' }}>
            <p className="text-white font-semibold mb-1">Test Rules</p>
            <ul className="space-y-1" style={{ color: 'rgba(240,240,248,0.55)' }}>
              <li>• 10 multiple-choice questions</li>
              <li>• 1 minute per question</li>
              <li>• Auto-submit on timer end</li>
              <li>• Results saved to your profile</li>
            </ul>
          </div>

          <button onClick={startTest} disabled={loadingQ}
            className="btn-brand w-full flex items-center justify-center gap-2 py-3">
            {loadingQ
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Play size={16} />}
            {loadingQ ? 'Loading Questions...' : 'Start Test'}
          </button>
        </div>
      </div>
    </Layout>
  );

  if (phase === 'result') return (
    <Layout title="Test Results">
      <ResultView questions={questions} answers={answers} timeTaken={timeTaken} score={score}
        onRetry={() => setPhase('config')} />
    </Layout>
  );

  // Test phase
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="chip chip-blue">{category}</span>
            <span className={`chip ${diffStyle[difficulty]}`}>{difficulty}</span>
          </div>
          <Timer_ seconds={seconds} />
          <p className="text-sm font-semibold" style={{ color: 'rgba(240,240,248,0.5)' }}>
            {current + 1} / {questions.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-8" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg,#4d75ff,#00f5a0)' }} />
        </div>

        {/* Question */}
        <div className="glass p-8 mb-6 animate-fade-in">
          <p className="text-xs font-semibold mb-4" style={{ color: 'rgba(240,240,248,0.4)' }}>QUESTION {current + 1}</p>
          <p className="text-white text-lg font-medium leading-relaxed mb-8">{q?.questionText}</p>

          <div className="space-y-3">
            {opts.map(({ key, text }) => {
              const selected = answers[current] === key;
              return (
                <button key={key} onClick={() => setAnswers(prev => ({ ...prev, [current]: key }))}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{
                    background: selected ? 'rgba(77,117,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${selected ? '#4d75ff' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: selected ? '#4d75ff' : 'rgba(255,255,255,0.06)',
                      color: selected ? 'white' : 'rgba(240,240,248,0.5)',
                    }}>{key}</span>
                  <span className="text-sm" style={{ color: selected ? 'white' : 'rgba(240,240,248,0.75)' }}>{text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,248,0.7)' }}>
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: i === current ? '#4d75ff' : answers[i] ? 'rgba(0,245,160,0.2)' : 'rgba(255,255,255,0.05)',
                  color: i === current ? 'white' : answers[i] ? '#00f5a0' : 'rgba(240,240,248,0.4)',
                }}>
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(c => c + 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,248,0.7)' }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-brand flex items-center gap-2 px-5 py-2.5">
              <CheckCircle size={16} /> Submit Test
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
