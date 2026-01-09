import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Megaphone, Edit, Trash2, Eye, PlusCircle } from "lucide-react";
import { Storage } from "../services/storage";
import { translations } from "../i18n";
import type { AdmissionEvent } from "../types";
import { CountdownTimer } from "../components/CountdownTimer";

/* =========================
   ✅ Time Slot (same key as EventDetails)
========================= */
type TimeSlot = { start: string; end?: string; note?: string };
const TIME_SLOTS_KEY = "adm_event_time_slots_v1";

function loadAllTimeSlots(): Record<string, TimeSlot> {
  try {
    return JSON.parse(localStorage.getItem(TIME_SLOTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function to12Hour(hhmm: string) {
  if (!hhmm || !hhmm.includes(":")) return "";
  const [hhStr, mm] = hhmm.split(":");
  const hh = parseInt(hhStr, 10);
  if (Number.isNaN(hh)) return hhmm;

  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${mm} ${suffix}`;
}

function formatSlot(slot?: TimeSlot) {
  if (!slot?.start) return "";
  const start = to12Hour(slot.start);
  const end = slot.end ? to12Hour(slot.end) : "";
  return end ? `${start} – ${end}` : start;
}
/* ========================= */

export const Home = ({ lang }: { lang: "en" | "bn" }) => {
  const t = translations[lang] ?? translations.en; // ✅ fallback
  const navigate = useNavigate();

  const [events, setEvents] = useState<AdmissionEvent[]>(() => Storage.getEvents());
  const [filters, setFilters] = useState({ cat: "All", search: "" });

  // ✅ time slots as state so it refreshes reliably
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot>>(() =>
    loadAllTimeSlots()
  );

  // ✅ refresh events + time slots when page focuses (after edit), and on first mount
  useEffect(() => {
    const refresh = () => {
      setEvents(Storage.getEvents());
      setTimeSlots(loadAllTimeSlots());
    };

    refresh();
    window.addEventListener("focus", refresh);

    // optional: if another tab changes localStorage
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const latest = useMemo(() => {
    const sorted = [...events]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);

    // seamless marquee
    return [...sorted, ...sorted];
  }, [events]);

  const categories = useMemo(
    () => [
      { key: "All", label: t.all ?? "All" },
      { key: "Admission", label: t.info ?? "Admission" },
      { key: "Exam", label: t.apply ?? "Exam" },
      { key: "Admit Card", label: t.admit ?? "Admit Card" },
      { key: "Result", label: t.result ?? "Result" },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        const c = filters.cat === "All" || e.category === filters.cat;
        const q = filters.search.trim().toLowerCase();
        const s =
          !q ||
          e.title.toLowerCase().includes(q) ||
          (e.notes || "").toLowerCase().includes(q);

        return c && s;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, filters]);

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        lang === "bn"
          ? "আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?"
          : "Are you sure you want to delete this event?"
      )
    ) {
      const up = events.filter((ev) => ev.id !== id);
      setEvents(up);
      Storage.saveEvents(up);
    }
  };

  // ✅ check if date is already passed
  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);

    return d.getTime() < today.getTime();
  };

  // ✅ marquee text: notes first, else show ended msg
  const marqueeText = (e: AdmissionEvent) => {
    const note = (e.notes || "").trim();

    if (note) return `${e.title}: ${note}`;

    if ((e.category === "Result" || e.category === "Exam") && isPast(e.date)) {
      return lang === "bn"
        ? `${e.title} — পরীক্ষা শেষ হয়েছে`
        : `${e.title} — Exam has ended`;
    }

    return e.title;
  };

  return (
    <div className="space-y-6 pb-40 animate-in fade-in duration-500">
      {/* Search & News */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        <div className="lg:col-span-8 space-y-3">
          {/* ✅ compact search */}
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder={t.search ?? "Search..."}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-base shadow-sm outline-none focus:ring-4 ring-indigo-500/5 focus:border-indigo-400 transition-all text-slate-800 dark:text-slate-100 font-bold"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* ✅ compact marquee */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-3 py-2 flex items-center shadow-sm h-12 overflow-hidden">
            <div className="bg-indigo-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center gap-2 z-10 shrink-0 shadow-lg">
              <Megaphone size={13} />
              <span>{t.latestNews ?? "Latest News"}</span>
            </div>

            <div className="flex-grow overflow-hidden relative ml-3">
              <div className="animate-marquee-seamless flex items-center gap-14 py-1">
                {latest.length > 0 ? (
                  latest.map((l, idx) => (
                    <div
                      key={`${l.id}-${idx}`}
                      className="flex items-center gap-3 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{marqueeText(l)}</span>
                      <span className="text-indigo-500 text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {l.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs italic">
                    {lang === "bn"
                      ? "সাম্প্রতিক কোনো ঘোষণা নেই"
                      : "No recent announcements"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event box */}
        <div className="lg:col-span-4">
          <button
            onClick={() => navigate("/add")}
            className="w-full h-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[2rem] flex items-center justify-between shadow-xl shadow-indigo-600/20 transition-all group overflow-hidden"
          >
            <div className="text-left">
              <h3 className="text-xl font-black leading-tight">
                {t.addEvent ?? "Add Event"}
              </h3>
              <p className="text-indigo-100 text-[10px] opacity-70 font-bold">
                Add Information/Updated Information
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl group-hover:rotate-90 transition-transform duration-500">
              <PlusCircle size={28} />
            </div>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 py-2 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilters({ ...filters, cat: c.key })}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all border-2 ${
              filters.cat === c.key
                ? "bg-slate-900 border-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900 dark:border-white"
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-slate-900 dark:bg-slate-950 text-white">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest w-[40%]">
                  {t.university ?? "University"}
                </th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest w-[30%]">
                  {t.examDate ?? "Exam Date"}
                </th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest w-[30%]">
                  {t.timeLeft ?? "Time Left"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((e) => {
                const slotText = formatSlot(timeSlots[e.id]);

                return (
                  <tr
                    key={e.id}
                    className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-all"
                  >
                    <td className="px-8 py-5">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-indigo-600 transition-colors">
                            {e.title}
                          </span>

                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-[9px] font-black text-indigo-500/80 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                              {e.category}
                            </span>

                            {/* ✅ time badge */}
                            {slotText && (
                              <span className="text-[9px] font-black text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                                {slotText}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ✅ buttons visible on mobile, hover-only on md+ */}
                        <div className="flex gap-2 opacity-100 translate-x-0 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all">
                          <button
                            onClick={() => navigate(`/event/${e.id}`)}
                            className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                            aria-label="View"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => navigate(`/edit/${e.id}`)}
                            className="p-2.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                            aria-label="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-2.5 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {new Date(e.date).toLocaleDateString(
                            lang === "bn" ? "bn-BD" : "en-GB",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </span>

                        <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {slotText
                            ? slotText
                            : lang === "bn"
                            ? "সময় সেট করা হয়নি"
                            : "Time not set"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <CountdownTimer targetDate={e.date} lang={lang} />
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200">
                        <Search size={20} />
                      </div>
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                        {t.noData ?? "No data"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
