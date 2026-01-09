
import React, { useState } from 'react';
import { Storage } from '../services/storage';
import { Todo } from '../types';
import { Plus, CheckCircle, Circle, Trash2, Calendar as CalIcon } from 'lucide-react';
import { translations } from '../i18n';

export const MyCalendar = ({ lang }: any) => {
  const t = translations[lang as keyof typeof translations];
  const [todos, setTodos] = useState<Todo[]>(Storage.getTodos());
  const [selDate, setSelDate] = useState(new Date().toISOString().split('T')[0]);
  const [newText, setNewText] = useState('');

  const filtered = todos.filter(t => t.date === selDate);

  const add = () => {
    if (!newText) return;
    const item = { id: Math.random().toString(), date: selDate, text: newText, completed: false };
    const up = [item, ...todos];
    setTodos(up);
    Storage.saveTodos(up);
    setNewText('');
  };

  const toggle = (id: string) => {
    const up = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(up);
    Storage.saveTodos(up);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-custom-card p-8 rounded-3xl shadow-xl border border-custom">
        <div className="flex items-center space-x-3 mb-8">
          <CalIcon className="text-indigo-600" size={32} />
          <h1 className="text-2xl font-bold">Personal Planner</h1>
        </div>

        <input 
          type="date" 
          value={selDate}
          onChange={e => setSelDate(e.target.value)}
          className="w-full p-4 mb-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-lg font-bold border-none text-indigo-600"
        />

        <div className="flex space-x-2 mb-8">
          <input 
            type="text" 
            placeholder="What needs to be done?"
            className="flex-grow p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button onClick={add} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            <Plus />
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group border border-transparent hover:border-indigo-100 transition-all">
              <div className="flex items-center space-x-4">
                <button onClick={() => toggle(item.id)} className="text-indigo-600">
                  {item.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <span className={`text-lg ${item.completed ? 'line-through text-custom-muted' : 'font-medium'}`}>{item.text}</span>
              </div>
              <button onClick={() => {
                const up = todos.filter(t => t.id !== item.id);
                setTodos(up);
                Storage.saveTodos(up);
              }} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-10 text-custom-muted italic">{t.noData} for this day.</div>}
        </div>
      </div>
    </div>
  );
};
