
import React, { useState } from 'react';
import { Storage } from '../services/storage';
import { Deadline } from '../types';
import { Clock, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { translations } from '../i18n';

export const DeadlineTracker = ({ lang }: any) => {
  const t = translations[lang as keyof typeof translations];
  const [deadlines, setDeadlines] = useState<Deadline[]>(Storage.getDeadlines());
  const [show, setShow] = useState(false);
  const [newD, setNewD] = useState<Omit<Deadline, 'id'>>({ title: '', date: '', priority: 'medium' });

  const sorted = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const add = () => {
    if (!newD.title || !newD.date) return;
    const item = { ...newD, id: Math.random().toString() };
    const up = [item, ...deadlines];
    setDeadlines(up);
    Storage.saveDeadlines(up);
    setShow(false);
  };

  const getDays = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Clock className="text-red-500" />
          <span>{t.deadlines}</span>
        </h1>
        <button onClick={() => setShow(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} />
          <span>Add Deadline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(d => {
          const days = getDays(d.date);
          const isUrgent = days <= 3;
          return (
            <div key={d.id} className={`bg-custom-card p-6 rounded-3xl border-2 shadow-sm transition-all ${isUrgent ? 'border-red-400' : 'border-custom'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${d.priority === 'high' ? 'bg-red-100 text-red-600' : d.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {d.priority}
                </span>
                <button onClick={() => {
                   const up = deadlines.filter(dl => dl.id !== d.id);
                   setDeadlines(up);
                   Storage.saveDeadlines(up);
                }} className="text-custom-muted hover:text-red-500"><Trash2 size={16}/></button>
              </div>
              <h3 className="text-xl font-bold mb-2">{d.title}</h3>
              <div className="flex items-center justify-between mt-6">
                <div className="text-custom-muted text-sm">{d.date}</div>
                <div className={`flex items-center space-x-1 font-bold ${isUrgent ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                  {isUrgent && <AlertTriangle size={14} />}
                  <span>{days} {t.daysLeft}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-custom-card w-full max-w-md p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Deadline</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Title" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none" onChange={e => setNewD({...newD, title: e.target.value})} />
              <input type="date" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none" onChange={e => setNewD({...newD, date: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none" onChange={e => setNewD({...newD, priority: e.target.value as any})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex space-x-2 pt-6">
                <button onClick={add} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold">Save</button>
                <button onClick={() => setShow(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 py-4 rounded-2xl font-bold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
