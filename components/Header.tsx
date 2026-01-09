import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Send,
  Home,
  BookOpen,
  Calendar,
  Clock,
  Menu,
  X,
  Facebook,
  Mail,
  Download,
  Globe,
} from "lucide-react";
import { translations, type Lang } from "../i18n";

type Theme = "light" | "dark";

type HeaderProps = {
  Theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  lang: Lang;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
};

export const Header: React.FC<HeaderProps> = ({ Theme, setTheme, lang, setLang }) => {
  const loc = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tx = (key: string) =>
    translations[lang]?.[key] ?? translations.en?.[key] ?? key;
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [loc.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "bn" : "en"));
  };

  const navLinks = [
    { to: "/", icon: Home, label: tx("dashboard") },
    { to: "/study", icon: BookOpen, label: tx("studyTracker") },
    { to: "/my-calendar", icon: Calendar, label: tx("myCalendar") },
    { to: "/deadlines", icon: Clock, label: tx("deadlines") },
  ];

  return (
    <>
      <header className="bg-indigo-600 dark:bg-slate-900 text-white shadow-xl sticky top-0 z-[100] transition-colors">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/calender_icon.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent)
                      parent.innerHTML =
                        '<span class="text-indigo-600 font-black text-xs">AC</span>';
                  }}
                />
              </div>
              <span className="text-lg font-black tracking-tighter hidden sm:inline">
                Admission 2025
              </span>
            </Link>
          </div>

          {/* desktop nav */}
          <nav className="hidden lg:flex items-center bg-white/10 p-1 rounded-xl">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  "px-4 py-1.5 rounded-lg transition-all flex items-center space-x-2 text-xs font-black uppercase tracking-tighter",
                  loc.pathname === l.to ? "bg-white text-indigo-600" : "hover:bg-white/5",
                ].join(" ")}
              >
                <l.icon size={14} />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-lg hidden sm:flex"
              aria-label="Toggle Theme"
            >
              {Theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                lang === "bn" ? "bg-green-500" : "bg-red-500"
              }`}
              aria-label="Toggle Language"
            >
              {lang === "en" ? "EN" : "BN"}
            </button>

            <a
              href="https://t.me/admissionnewscorner"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-sky-500 hover:bg-sky-600 rounded-xl shadow-lg"
              aria-label="Telegram"
            >
              <Send size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <div className={`fixed inset-0 z-[200] ${isMenuOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 w-80 h-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-indigo-600 text-white">
              <h2 className="text-xl font-black">{tx("Menu")}</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  {tx("dashboard")}
                </p>

                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
                  >
                    <l.icon size={18} className="text-indigo-600" />
                    <span className="text-slate-900 dark:text-slate-100">{l.label}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  {tx("about")}
                </p>

                <a
                  href="https://www.facebook.com/admissioncalendarbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
                >
                  <Facebook size={18} className="text-blue-600" />
                  <span className="text-slate-900 dark:text-slate-100">{tx("Facebook Page")}</span>
                </a>

                <a
                  href="mailto:mail@admission-calendar.com"
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
                >
                  <Mail size={18} className="text-slate-500" />
                  <span className="text-slate-900 dark:text-slate-100">{tx("Mail")}</span>
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  {tx("download")}
                </p>

                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-left">
                  <Download size={18} className="text-indigo-600" />
                  <span className="text-slate-900 dark:text-slate-100">{tx("Download PDF")}</span>
                </button>

                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-left">
                  <Download size={18} className="text-emerald-600" />
                  <span className="text-slate-900 dark:text-slate-100">{tx("Download Excel")}</span>
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  {tx("settings")}
                </p>

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-left"
                >
                  {Theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-slate-900 dark:text-slate-100">{tx("Theme")}</span>
                </button>

                <button
                  onClick={toggleLang}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-left"
                >
                  <Globe size={18} />
                  <span className="text-slate-900 dark:text-slate-100">
                    {tx("Language")}: {lang === "en" ? "EN" : "BN"}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Admission Calendar © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
