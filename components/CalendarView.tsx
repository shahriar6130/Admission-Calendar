import React from "react";
import { AdmissionEvent } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  events: AdmissionEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const totalDays = daysInMonth(month, year);
  const startDay = startDayOfMonth(month, year);

  const calendarDays: Array<number | null> = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Admission":
        return "bg-blue-500";
      case "Exam":
        return "bg-orange-500";
      case "Result":
        return "bg-green-500";
      case "Admit Card":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const IconBtn =
    "h-11 w-11 inline-flex items-center justify-center rounded-xl " +
    "bg-slate-50 dark:bg-slate-800/60 " +
    "border border-slate-200 dark:border-slate-700 " +
    "text-slate-700 dark:text-slate-100 " +
    "hover:bg-slate-100 dark:hover:bg-slate-800 " +
    "active:scale-95 transition " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950";

  const TextBtn =
    "h-11 px-4 inline-flex items-center justify-center rounded-xl " +
    "bg-slate-50 dark:bg-slate-800/60 " +
    "border border-slate-200 dark:border-slate-700 " +
    "text-slate-800 dark:text-slate-100 " +
    "hover:bg-slate-100 dark:hover:bg-slate-800 " +
    "active:scale-[0.98] transition " +
    "font-bold text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950";

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate)}
        </h2>

        {/* ✅ Bigger, visible, fully clickable controls */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMonth} className={IconBtn} aria-label="Previous month" title="Previous month">
            <ChevronLeft size={22} />
          </button>

          <button type="button" onClick={goToday} className={TextBtn} aria-label="Go to today" title="Today">
            Today
          </button>

          <button type="button" onClick={nextMonth} className={IconBtn} aria-label="Next month" title="Next month">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-fr min-h-[420px]">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="border-r border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
              />
            );
          }

          const dayEvents = getEventsForDay(day);
          const isToday =
            new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={day}
              className={[
                "border-r border-b border-slate-200 dark:border-slate-800 p-2 min-h-[110px] flex flex-col",
                "hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors",
                idx % 7 === 6 ? "border-r-0" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-extrabold mb-1 w-8 h-8 flex items-center justify-center rounded-full",
                  isToday ? "bg-indigo-600 text-white" : "text-slate-800 dark:text-slate-100",
                ].join(" ")}
              >
                {day}
              </span>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    title={event.title}
                    className={[
                      "text-[11px] px-2 py-1 rounded-lg text-white font-bold truncate",
                      getCategoryColor(event.category),
                    ].join(" ")}
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-300 pl-1 font-semibold">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
