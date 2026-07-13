import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/common/Layout';
import { resumeService } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Star, Lightbulb, X } from 'lucide-react';

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  const color = score >= 75 ? '#00f5a0' : score >= 50 ? '#ffa500' : '#ff5050';

  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="72" cy="72" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-display font-black" style={{ color }}>{score}</span>
        <span className="text-xs" style={{ color: 'rgba(240,240,248,0.5)' }}>ATS Score</span>
      </div>
    </div>
  );
};

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    resumeService.getMyResumes().then(r => setResumes(r.data.data || [])).catch(() => {});
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }

    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const res = await resumeService.upload(fd);
      const newResume = res.data.data;
      setResumes(prev => [newResume, ...prev]);
      setSelected(newResume);
      toast.success('Resume uploaded and analyzed! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  const scoreLabel = (s) => s >= 75 ? 'Excellent' : s >= 50 ? 'Good' : s >= 30 ? 'Fair' : 'Poor';
  const scoreChip = (s) => s >= 75 ? 'chip-green' : s >= 50 ? 'chip-orange' : 'chip-red';

  return (
    <Layout title="Resume ATS Analyzer" subtitle="Upload your resume PDF to get an ATS compatibility score">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !uploading && fileRef.current?.click()}
            className="glass rounded-2xl p-12 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? '#4d75ff' : 'rgba(255,255,255,0.06)',
              background: dragOver ? 'rgba(77,117,255,0.08)' : 'rgba(255,255,255,0.03)',
            }}>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={e => handleUpload(e.target.files[0])} />
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin" style={{ color: '#4d75ff' }} />
                <p className="font-display font-bold text-white">Analyzing your resume...</p>
                <p className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>
                  Extracting text & calculating ATS score
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(77,117,255,0.12)', border: '1px solid rgba(77,117,255,0.2)' }}>
                  <Upload size={28} style={{ color: '#4d75ff' }} />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-lg">Drop your resume here</p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(240,240,248,0.4)' }}>
                    or click to browse — PDF only, max 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed View of selected resume */}
          {selected && (
            <div className="glass p-6 animate-slide-up">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">{selected.fileName}</h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(240,240,248,0.4)' }}>
                    {(selected.fileSize / 1024).toFixed(1)} KB · {new Date(selected.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: 'rgba(240,240,248,0.4)' }}>
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <ScoreRing score={selected.atsScore || 0} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`chip ${scoreChip(selected.atsScore)}`}>
                      {scoreLabel(selected.atsScore)}
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(240,240,248,0.5)' }}>
                      ATS Compatibility
                    </span>
                  </div>

                  {selected.skills && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(240,240,248,0.5)' }}>DETECTED SKILLS</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.skills.split(',').slice(0, 12).map(s => (
                          <span key={s} className="chip chip-blue text-xs">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selected.atsSuggestions && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} style={{ color: '#ffa500' }} />
                    <p className="text-sm font-semibold" style={{ color: '#ffa500' }}>Improvement Suggestions</p>
                  </div>
                  <ul className="space-y-2">
                    {selected.atsSuggestions.split('|').map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(240,240,248,0.65)' }}>
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#ffa500' }} />
                        {s.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload History */}
        <div className="glass p-5">
          <h3 className="font-display font-bold text-white mb-4">Upload History</h3>
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <FileText size={32} style={{ color: 'rgba(240,240,248,0.15)' }} />
              <p className="text-sm text-center" style={{ color: 'rgba(240,240,248,0.4)' }}>
                No resumes yet.<br />Upload your first resume!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map(r => (
                <button key={r.id} onClick={() => setSelected(r)}
                  className="w-full text-left p-3 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: selected?.id === r.id ? 'rgba(77,117,255,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selected?.id === r.id ? 'rgba(77,117,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white truncate max-w-[160px]">{r.fileName}</p>
                    <span className="font-bold text-sm" style={{
                      color: r.atsScore >= 75 ? '#00f5a0' : r.atsScore >= 50 ? '#ffa500' : '#ff5050'
                    }}>{r.atsScore}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={12} style={{ color: '#00f5a0' }} />
                    <p className="text-xs" style={{ color: 'rgba(240,240,248,0.4)' }}>
                      {new Date(r.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
