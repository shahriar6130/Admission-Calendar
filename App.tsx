import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";

import { Home } from "./pages/Home";
import { StudyTracker } from "./pages/StudyTracker";
import { MyCalendar } from "./pages/MyCalendar";
import { DeadlineTracker } from "./pages/DeadlineTracker";

import AddEditEvent from "./pages/AddEditEvent";
import EventDetails from "./pages/EventDetails";

import { Storage } from "./services/storage";
import { translations } from "./i18n";

type Theme = "light" | "dark";
type Lang = "en" | "bn";

const App: React.FC = () => {
  const [Theme, setTheme] = useState<Theme>(() => {
    const saved = Storage.getTheme();
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  const [lang, setLang] = useState<Lang>(() => {
    const saved = Storage.getLang();
    return saved === "bn" || saved === "en" ? saved : "en";
  });

  const t = translations[lang] ?? translations.en;

  //(Tailwind + data-Theme + meta + storage)
  useEffect(() => {
    const root = document.documentElement;

    // Tailwind dark mode
    root.classList.toggle("dark", Theme === "dark");

    // CSS variables mode
    root.dataset.Theme = Theme;

    // Persist
    Storage.setTheme(Theme);

    // Browser topbar / PWA Theme color
    const meta = document.querySelector('meta[name="Theme-color"]');
    if (meta) meta.setAttribute("content", Theme === "dark" ? "#020617" : "#4f46e5");
  }, [Theme]);

  //LANGUAGE SYNC
  useEffect(() => {
    document.documentElement.lang = lang;
    Storage.setLang(lang);
  }, [lang]);

  //stable props for Header
  const headerProps = useMemo(
    () => ({ Theme, setTheme, lang, setLang }),
    [Theme, lang]
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        <Header {...headerProps} />

        <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/study" element={<StudyTracker lang={lang} />} />
            <Route path="/my-calendar" element={<MyCalendar lang={lang} />} />
            <Route path="/deadlines" element={<DeadlineTracker lang={lang} />} />

            <Route path="/add" element={<AddEditEvent lang={lang} />} />
            <Route path="/edit/:id" element={<AddEditEvent lang={lang} />} />
            <Route path="/event/:id" element={<EventDetails lang={lang} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/*Footer (keep simple, you can customize) */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container mx-auto max-w-7xl px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-300">
            <p className="text-xs">
              {lang === "bn" ? "" : <b>For More Updates Join:</b>}{" "}
              <a
                href="https://t.me/admissionnewscorner"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
              >
                Telegram
              </a>
            </p>

            <p className="text-xs mt-2">
              {lang === "bn" ? "অ্যাডমিশন ক্যালেন্ডার" : "Admission Calendar"} ©{" "}
              {new Date().getFullYear()}
            </p>

            <p className="text-[11px] mt-1 text-slate-400">
              {lang === "bn"
                ? "ভালো অভিজ্ঞতার জন্য PWA হিসেবে ইনস্টল করুন।"
                : "Install as a PWA for best experience."}
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
};

export default App;
