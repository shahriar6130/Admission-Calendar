import React from "react";
import { useNavigate } from "react-router-dom";
import type { AdmissionEvent, Category } from "../types";
import { Storage } from "../services/storage";
import { translations } from "../i18n";

/* =========================
   ✅ Time Slots Storage
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

function getTimeSlot(eventId: string): TimeSlot | undefined {
  const all = loadAllTimeSlots();
  return all[eventId];
}

function setTimeSlot(eventId: string, slot: TimeSlot) {
  const all = loadAllTimeSlots();
  all[eventId] = slot;
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(all));
}

function removeTimeSlot(eventId: string) {
  const all = loadAllTimeSlots();
  delete all[eventId];
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(all));
}
/* ========================= */

type Props = {
  initialData?: AdmissionEvent;
};

const categories: Category[] = ["Admission", "Exam", "Result", "Admit Card", "Other"];

const EventForm: React.FC<Props> = ({ initialData }) => {
  const navigate = useNavigate();

  // language for labels (safe)
  const lang = (Storage.getLang?.() as "en" | "bn") || "en";
  const t = translations[lang] ?? translations.en;

  // ----------- Event Fields -----------
  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [date, setDate] = React.useState(initialData?.date ?? "");
  const [category, setCategory] = React.useState<Category>(initialData?.category ?? "Admission");
  const [eligibility, setEligibility] = React.useState(initialData?.eligibility ?? "");
  const [websiteLink, setWebsiteLink] = React.useState(initialData?.websiteLink ?? "");
  const [admitCardLink, setAdmitCardLink] = React.useState(initialData?.admitCardLink ?? "");
  const [notes, setNotes] = React.useState(initialData?.notes ?? "");

  // ----------- Time Slot Fields -----------
  const [timeStart, setTimeStart] = React.useState("");
  const [timeEnd, setTimeEnd] = React.useState("");
  const [timeNote, setTimeNote] = React.useState("");

  // Load time slot when editing
  React.useEffect(() => {
    if (!initialData?.id) return;

    const slot = getTimeSlot(initialData.id);
    setTimeStart(slot?.start ?? "");
    setTimeEnd(slot?.end ?? "");
    setTimeNote(slot?.note ?? "");
  }, [initialData?.id]);

  const makeId = () => {
    // works in all browsers
    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim()) {
      alert(lang === "bn" ? "শিরোনাম এবং তারিখ প্রয়োজন।" : "Title and Date are required.");
      return;
    }

    const all = Storage.getEvents();
    const id = initialData?.id ?? makeId();

    const newEvent: AdmissionEvent = {
      id,
      title: title.trim(),
      date: date.trim(),
      category,
      eligibility: eligibility.trim(),
      websiteLink: websiteLink.trim(),
      admitCardLink: admitCardLink.trim(),
      notes: notes.trim() || undefined,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    };

    const updated = initialData?.id
      ? all.map((ev) => (ev.id === id ? newEvent : ev))
      : [newEvent, ...all];

    Storage.saveEvents(updated);

    // ✅ Save Time Slot (only if start time exists)
    if (timeStart.trim()) {
      setTimeSlot(id, {
        start: timeStart.trim(),
        end: timeEnd.trim() || undefined,
        note: timeNote.trim() || undefined,
      });
    } else {
      // if user clears time, remove it
      removeTimeSlot(id);
    }

    navigate(`/event/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {initialData ? (lang === "bn" ? "ইভেন্ট এডিট করুন" : "Edit Event") : (lang === "bn" ? "নতুন ইভেন্ট যোগ করুন" : "Add New Event")}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:opacity-80"
        >
          {lang === "bn" ? "ফিরে যান" : "Back"}
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
          {lang === "bn" ? "ইভেন্ট নাম" : "Event Title"}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
          placeholder={t.university ?? "University name..."}
        />
      </div>

      {/* Date + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            {lang === "bn" ? "তারিখ" : "Date"}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            {lang === "bn" ? "ক্যাটাগরি" : "Category"}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Time Slot Box (what you asked for) */}
      <div className="space-y-3">
        <div className="text-sm font-black text-slate-700 dark:text-slate-200">
          {lang === "bn" ? "সময় সেট করুন" : "Set Time"}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
              {lang === "bn" ? "শুরুর সময়" : "Start Time"}
            </label>
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
              {lang === "bn" ? "শেষ সময় (ঐচ্ছিক)" : "End Time (optional)"}
            </label>
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            {lang === "bn" ? "সময় নোট (ঐচ্ছিক)" : "Time Note (optional)"}
          </label>
          <input
            value={timeNote}
            onChange={(e) => setTimeNote(e.target.value)}
            placeholder={lang === "bn" ? "যেমন: Unit A ও Unit B আলাদা সময়" : "e.g. Unit A and Unit B times differ"}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Eligibility */}
      <div>
        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
          {lang === "bn" ? "যোগ্যতা" : "Eligibility"}
        </label>
        <textarea
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
        />
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            {t.website ?? "Website Link"}
          </label>
          <input
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            {t.admitCard ?? "Admit Card Link"}
          </label>
          <input
            value={admitCardLink}
            onChange={(e) => setAdmitCardLink(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
          {t.notes ?? (lang === "bn" ? "নোট" : "Notes")}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-4 ring-indigo-500/10"
          placeholder={lang === "bn" ? "এখানে নোট লিখুন..." : "Write notes here..."}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl shadow-lg shadow-indigo-600/20"
        >
          {initialData ? (lang === "bn" ? "আপডেট করুন" : "Update") : (lang === "bn" ? "সেভ করুন" : "Save")}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:opacity-80"
        >
          {lang === "bn" ? "বাতিল" : "Cancel"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
