
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, Calendar as CalIcon, LayoutGrid, BookOpen, MoreHorizontal } from 'lucide-react';
import { translations } from '../i18n';

export const BottomNav = ({ lang }: { lang: 'en' | 'bn' }) => {
  const t = translations[lang];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl px-6 py-3 flex justify-between items-center z-[100]">
      <NavLink to="/deadlines" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
        <Clock size={20} />
        <span className="text-[10px] font-bold">{t.deadlines}</span>
      </NavLink>
      
      <NavLink to="/my-calendar" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
        <CalIcon size={20} />
        <span className="text-[10px] font-bold">{t.myCalendar}</span>
      </NavLink>

      <div className="relative -top-8">
        <NavLink to="/" className={({isActive}) => `w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-white dark:border-slate-900 ${isActive ? 'bg-indigo-600 text-white rotate-12 scale-110' : 'bg-slate-800 text-slate-300'}`}>
          <LayoutGrid size={28} />
        </NavLink>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">{t.fullCalendar}</span>
      </div>

      <NavLink to="/study" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
        <BookOpen size={20} />
        <span className="text-[10px] font-bold">{t.studyTracker}</span>
      </NavLink>
    </nav>
    
  );
};
