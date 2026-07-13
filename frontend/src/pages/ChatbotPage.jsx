import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { chatService } from '../services/api';
import toast from 'react-hot-toast';
import { Send, Bot, User, Plus, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

const CATEGORIES = ['JAVA', 'REACT', 'SQL', 'HR', 'DSA', 'PYTHON', 'GENERAL'];

const catColor = {
  JAVA: '#4d75ff', REACT: '#00f5a0', SQL: '#ffa500',
  HR: '#a855f7', DSA: '#ff6b6b', PYTHON: '#f59e0b', GENERAL: '#60a5fa'
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [category, setCategory] = useState('GENERAL');
  const [started, setStarted] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startSession = () => {
    const welcome = {
      role: 'assistant',
      content: `Hello! I'm your AI interviewer today. We'll be focusing on **${category}** topics.\n\nLet's begin! Tell me about yourself and your experience with ${category}.`,
      ts: new Date()
    };
    setMessages([welcome]);
    setStarted(true);
  };

  const newSession = () => {
    setSessionId(uuidv4());
    setMessages([]);
    setStarted(false);
    setInput('');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatService.sendMessage({
        sessionId,
        category,
        message: text
      });
      const aiMsg = { role: 'assistant', content: res.data.data.response, ts: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      toast.error('Failed to send message. Check API connection.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your API configuration.",
        ts: new Date()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <Layout title="Mock Interview Chatbot" subtitle="Practice with an AI interviewer in real-time">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">

        {/* Sidebar config */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass p-4">
            <h3 className="font-display font-bold text-white mb-3 text-sm">Interview Topic</h3>
            <div className="space-y-1.5">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => !started && setCategory(c)}
                  disabled={started}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-2"
                  style={{
                    background: category === c ? `${catColor[c]}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${category === c ? catColor[c] + '40' : 'rgba(255,255,255,0.05)'}`,
                    color: category === c ? catColor[c] : 'rgba(240,240,248,0.45)',
                    opacity: started && category !== c ? 0.4 : 1,
                    cursor: started ? 'not-allowed' : 'pointer'
                  }}>
                  <span style={{ color: catColor[c] }}>●</span> {c}
                </button>
              ))}
            </div>
          </div>

          <button onClick={newSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,248,0.7)' }}>
            <Plus size={15} /> New Session
          </button>

          <div className="glass p-4 text-xs space-y-2" style={{ color: 'rgba(240,240,248,0.5)' }}>
            <p className="font-semibold text-white mb-1">Tips</p>
            <p>• Answer thoroughly, include examples</p>
            <p>• Use STAR method for HR questions</p>
            <p>• Ask clarifying questions</p>
            <p>• Press Enter to send</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 glass flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${catColor[category]}18`, border: `1px solid ${catColor[category]}30` }}>
              <Bot size={18} style={{ color: catColor[category] }} />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">AI Interviewer</p>
              <p className="text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>
                {category} Interview · Session {sessionId.slice(0, 8)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'rgba(240,240,248,0.5)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {!started && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${catColor[category]}12`, border: `1px solid ${catColor[category]}25` }}>
                  <Bot size={30} style={{ color: catColor[category] }} />
                </div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-white text-lg mb-1">Ready for your {category} Interview?</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,240,248,0.45)' }}>
                    Select a topic on the left, then start the session
                  </p>
                </div>
                <button onClick={startSession} className="btn-brand flex items-center gap-2">
                  <Bot size={16} /> Start Interview
                </button>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-600' : ''}`}
                  style={msg.role !== 'user' ? { background: `${catColor[category]}18`, border: `1px solid ${catColor[category]}30` } : {}}>
                  {msg.role === 'user'
                    ? <User size={14} className="text-white" />
                    : <Bot size={14} style={{ color: catColor[category] }} />}
                </div>
                <div className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-user text-white' : 'chat-ai'}`}
                  style={msg.role !== 'user' ? { color: 'rgba(240,240,248,0.85)' } : {}}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  <p className="text-xs mt-1.5 opacity-40">{msg.ts?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${catColor[category]}18`, border: `1px solid ${catColor[category]}30` }}>
                  <Bot size={14} style={{ color: catColor[category] }} />
                </div>
                <div className="chat-ai px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {started && (
            <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="form-input flex-1 resize-none"
                  style={{ minHeight: 60 }}
                  disabled={loading}
                />
                <button onClick={sendMessage} disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#4d75ff,#1a44ff)' }}>
                  {loading ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
