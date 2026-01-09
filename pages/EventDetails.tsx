import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Globe,
  FileText,
  CheckCircle2,
  StickyNote,
  Edit,
  Trash2,
  Share2,
  Clock,
} from "lucide-react";
import { getEventById, deleteEvent } from "../services/eventService";
import { AdmissionEvent } from "../types";
import { translations } from "../i18n";

/* =========================
   ✅ Time Slot Storage (shared key)
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

function saveAllTimeSlots(data: Record<string, TimeSlot>) {
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(data));
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

const EventDetails: React.FC<{ lang: "en" | "bn" }> = ({ lang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = React.useState<AdmissionEvent | undefined>(undefined);
  const t = translations[lang] ?? translations.en;

  // ✅ time slot state
  const [slot, setSlot] = React.useState<TimeSlot>({ start: "", end: "", note: "" });
  const [savedMsg, setSavedMsg] = React.useState("");

  React.useEffect(() => {
    if (id) {
      const found = getEventById(id);
      setEvent(found);

      // load existing slot
      const all = loadAllTimeSlots();
      const existing = all[id];
      if (existing) {
        setSlot({
          start: existing.start || "",
          end: existing.end || "",
          note: existing.note || "",
        });
      }
    }
  }, [id]);

  if (!event)
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Info size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">
          Event not found
        </h2>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20"
        >
          Back to Dashboard
        </Link>
      </div>
    );

  const formattedDate = new Date(event.date).toLocaleDateString(
    lang === "bn" ? "bn-BD" : "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const handleDelete = () => {
    if (
      window.confirm(
        lang === "bn" ? "আপনি কি এটি মুছে ফেলতে চান?" : "Delete this event?"
      )
    ) {
      deleteEvent(event.id);
      navigate("/");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} admission details on Admission Calendar 2025`,
        url: window.location.href,
      });
    }
  };

  // ✅ save time slot
  const handleSaveSlot = () => {
    if (!id) return;
    const all = loadAllTimeSlots();

    // if start is empty => remove saved slot
    if (!slot.start.trim()) {
      delete all[id];
      saveAllTimeSlots(all);
      setSavedMsg(lang === "bn" ? "সময় মুছে ফেলা হয়েছে ✅" : "Time removed ✅");
      setTimeout(() => setSavedMsg(""), 2000);
      return;
    }

    all[id] = {
      start: slot.start.trim(),
      end: slot.end?.trim() || "",
      note: slot.note?.trim() || "",
    };

    saveAllTimeSlots(all);
    setSavedMsg(lang === "bn" ? "সময় সংরক্ষণ হয়েছে ✅" : "Time saved ✅");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const slotText = formatSlot(slot);

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-black transition-colors bg-white dark:bg-slate-900 px-5 py-2.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <ArrowLeft size={18} className="mr-2" />
          {lang === "bn" ? "ড্যাশবোর্ডে ফিরুন" : "Back to Results"}
        </button>

        <button
          onClick={handleShare}
          className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-all active:scale-90"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 dark:border-slate-800">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 md:p-14 text-white relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <span className="px-5 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500 shadow-xl shadow-indigo-600/20">
                {event.category}
              </span>
              <div className="flex gap-3">
                <Link
                  to={`/edit/${event.id}`}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-xl transition-all border border-white/10"
                  title="Edit Event"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-3 bg-white/10 hover:bg-red-500/80 rounded-2xl backdrop-blur-xl transition-all border border-white/10"
                  title="Delete Event"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-8 leading-[1.15]">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
                <Calendar size={20} className="text-indigo-500" />
                <span className="font-bold text-slate-200">{formattedDate}</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
                <Clock size={20} className="text-indigo-500" />
                <span className="font-bold text-slate-200">
                  {slotText
                    ? slotText
                    : lang === "bn"
                    ? "সময় সেট করা হয়নি"
                    : "Time not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
            <FileText size={400} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 md:p-14 space-y-14">
          {/* ✅ Custom Time Slot Box */}
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-50">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200">
                <Clock size={22} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {lang === "bn" ? "সময় নির্ধারণ করুন" : "Set Time Slot"}
              </h2>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? "শুরু" : "Start"}
                  </label>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => setSlot((s) => ({ ...s, start: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? "শেষ" : "End"}
                  </label>
                  <input
                    type="time"
                    value={slot.end || ""}
                    onChange={(e) => setSlot((s) => ({ ...s, end: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? "নোট" : "Note"}
                  </label>
                  <input
                    type="text"
                    value={slot.note || ""}
                    onChange={(e) => setSlot((s) => ({ ...s, note: e.target.value }))}
                    placeholder={lang === "bn" ? "যেমন: কেন্দ্র/রুম" : "e.g. Center/Room"}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveSlot}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all"
                >
                  {lang === "bn" ? "সংরক্ষণ করুন" : "Save Time"}
                </button>

                {savedMsg && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {savedMsg}
                  </span>
                )}

                {/* show note preview */}
                {(slot.note || "").trim() && (
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    {lang === "bn" ? "নোট:" : "Note:"} {slot.note}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {lang === "bn" ? "যোগ্যতা ও শর্তাবলী" : "Eligibility & Requirements"}
              </h2>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {event.eligibility}
            </div>
          </section>

          {/* Notes */}
          {event.notes && (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <StickyNote size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {lang === "bn" ? "বিশেষ দ্রষ্টব্য" : "Important Notes"}
                </h2>
              </div>
              <div className="p-8 rounded-[2rem] border-2 border-orange-100 dark:border-orange-500/10 border-dashed text-slate-600 dark:text-slate-400 italic text-lg leading-relaxed bg-orange-50/20 dark:bg-orange-900/5">
                {event.notes}
              </div>
            </section>
          )}

          {/* Action Links */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <a
              href={event.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-8 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 transition-all duration-300 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-500/20 shadow-xl shadow-indigo-500/5"
            >
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="text-indigo-600" size={28} />
                </div>
                <div>
                  <div className="font-black text-slate-800 dark:text-slate-100 group-hover:text-white text-xl transition-colors">
                    {t.website ?? "Website"}
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-indigo-100 transition-colors uppercase font-black tracking-widest mt-1">
                    Admission Portal
                  </div>
                </div>
              </div>
              <ArrowLeft
                className="rotate-180 text-indigo-300 group-hover:text-white group-hover:translate-x-2 transition-all"
                size={24}
              />
            </a>

            <a
              href={event.admitCardLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-300 shadow-xl shadow-emerald-500/5 ${
                event.admitCardLink
                  ? "bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 border-emerald-100 dark:border-emerald-500/20"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 grayscale cursor-not-allowed opacity-50"
              }`}
              onClick={(e) => !event.admitCardLink && e.preventDefault()}
            >
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="text-emerald-600" size={28} />
                </div>
                <div>
                  <div className="font-black text-slate-800 dark:text-slate-100 group-hover:text-white text-xl transition-colors">
                    {t.admitCard ?? "Admit Card"}
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-emerald-100 transition-colors uppercase font-black tracking-widest mt-1">
                    {event.admitCardLink ? "Download Available" : "Coming Soon"}
                  </div>
                </div>
              </div>
              {event.admitCardLink && (
                <ArrowLeft
                  className="rotate-180 text-emerald-300 group-hover:text-white group-hover:translate-x-2 transition-all"
                  size={24}
                />
              )}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

const Info = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default EventDetails;
