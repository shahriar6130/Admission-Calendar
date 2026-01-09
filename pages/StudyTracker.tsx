
import React, { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import { Subject, StudySession } from '../types';
import { Plus, Trash2, Clock, Calendar as CalIcon } from 'lucide-react';
import { translations } from '../i18n';

export const StudyTracker = ({ lang }: any) => {
  const t = translations[lang as keyof typeof translations];
  const [subjects, setSubjects] = useState<Subject[]>(Storage.getSubjects());
  const [sessions, setSessions] = useState<StudySession[]>(Storage.getStudy());
  const [showAdd, setShowAdd] = useState(false);
  
  const [newSession, setNewSession] = useState({ subjectId: '', minutes: 0, date: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    if (subjects.length > 0) setNewSession(s => ({ ...s, subjectId: subjects[0].id }));
  }, [subjects]);

  const handleAdd = () => {
    const session = { ...newSession, id: Math.random().toString() };
    const updated = [session, ...sessions];
    setSessions(updated);
    Storage.saveStudy(updated);
    setShowAdd(false);
  };

  const todayTotal = sessions
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.minutes, 0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayTotal = sessions.filter(s => s.date === dateStr).reduce((acc, curr) => acc + curr.minutes, 0);
    return { date: dateStr, mins: dayTotal, label: d.getDate() };
  });

  const maxMins = Math.max(...last7Days.map(d => d.mins), 60);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-custom-main">Study Hour Tracker</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 font-bold hover:bg-indigo-700"
        >
          <Plus size={18} />
          <span>{t.addSession}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-custom-card p-6 rounded-2xl shadow-sm border border-custom">
          <h3 className="text-custom-muted text-sm font-bold uppercase tracking-widest mb-4">Summary</h3>
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-500">{todayTotal}</div>
              <div className="text-xs text-custom-muted">{t.todayStudy} ({t.mins})</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">
                {sessions.reduce((a, b) => a + b.minutes, 0)}
              </div>
              <div className="text-xs text-custom-muted">Total Time</div>
            </div>
          </div>
        </div>

        <div className="bg-custom-card p-6 rounded-2xl shadow-sm border border-custom">
          <h3 className="text-custom-muted text-sm font-bold uppercase tracking-widest mb-4">Study Graph (Last 7 Days)</h3>
          <div className="h-32 flex items-end space-x-2">
            {last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-indigo-500 rounded-t-md transition-all group-hover:bg-indigo-400" 
                  style={{ height: `${(d.mins / maxMins) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.mins}m
                  </div>
                </div>
                <div className="text-[10px] mt-2 text-custom-muted">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-custom-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-custom">
            <h2 className="text-xl font-bold mb-4">{t.addSession}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-custom-muted block mb-1">{t.subject}</label>
                <select 
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none"
                  value={newSession.subjectId}
                  onChange={e => setNewSession({...newSession, subjectId: e.target.value})}
                >
                
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-custom-muted block mb-1">Duration (Mins)</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none"
                  onChange={e => setNewSession({...newSession, minutes: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-custom-muted block mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none"
                  value={newSession.date}
                  onChange={e => setNewSession({...newSession, date: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Add</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-2 rounded-lg font-bold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-custom-card rounded-2xl shadow-sm border border-custom overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-xs font-bold text-custom-muted uppercase">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom text-sm">
            {sessions.slice(0, 10).map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-6 py-4">{s.date}</td>
                <td className="px-6 py-4 font-medium">{subjects.find(sub => sub.id === s.subjectId)?.name || 'Deleted Subject'}</td>
                <td className="px-6 py-4">{s.minutes} {t.mins}</td>
                <td className="px-6 py-4">
                  <button onClick={() => {
                    const updated = sessions.filter(sess => sess.id !== s.id);
                    setSessions(updated);
                    Storage.saveStudy(updated);
                  }} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
