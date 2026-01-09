export type Lang = "en" | "bn";

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    studyTracker: "Study Tracker",
    myCalendar: "My Calendar",
    deadlines: "Deadlines",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    delete: "Delete",
    view: "View",
    search: "Search events...",
    month: "Month",
    category: "Category",
    eligibility: "Eligibility",
    website: "Website",
    admitCard: "Admit Card",
    notes: "Notes",
    save: "Save",
    cancel: "Cancel",
    todayStudy: "Today Study",
    thisWeek: "This Week",
    mins: "mins",
    addSession: "Add Session",
    subject: "Subject",
    priority: "Priority",
    daysLeft: "Days left",
    latestNews: "Latest News",
    telegram: "Telegram",
    noData: "No data yet",
    latestAlerts: "Latest Alerts",
    noAnnouncements: "No recent announcements",

    confirmDeleteEvent: "Delete this event?",
    viewDetails: "View Details",

    addDeadline: "Add Deadline",
    newDeadline: "New Deadline",
    date: "Date",
    title: "Title",
    close: "Close",
    saveDeadline: "Save Deadline"
  },

  bn: {
    dashboard: "ড্যাশবোর্ড",
    studyTracker: "স্টাডি ট্র্যাকার",
    myCalendar: "আমার ক্যালেন্ডার",
    deadlines: "ডেডলাইন",
    addEvent: "ইভেন্ট যোগ করুন",
    editEvent: "ইভেন্ট সম্পাদনা",
    delete: "ডিলিট",
    view: "দেখুন",
    search: "ইভেন্ট খুঁজুন...",
    month: "মাস",
    category: "ক্যাটাগরি",
    eligibility: "যোগ্যতা",
    website: "ওয়েবসাইট",
    admitCard: "অ্যাডমিট কার্ড",
    notes: "নোট",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    todayStudy: "আজকের পড়া",
    thisWeek: "এই সপ্তাহ",
    mins: "মিনিট",
    addSession: "সেশন যোগ করুন",
    subject: "বিষয়",
    priority: "অগ্রাধিকার",
    daysLeft: "দিন বাকি",
    latestNews: "সর্বশেষ খবর",
    telegram: "টেলিগ্রাম",
    noData: "এখনও কোনো তথ্য যোগ করা হয়নি",
    latestAlerts: "সর্বশেষ নোটিশ",
    noAnnouncements: "সাম্প্রতিক কোনো ঘোষণা নেই",

    confirmDeleteEvent: "আপনি কি ইভেন্টটি ডিলিট করতে চান?",
    viewDetails: "বিস্তারিত দেখুন",

    addDeadline: "ডেডলাইন যোগ করুন",
    newDeadline: "নতুন ডেডলাইন",
    date: "তারিখ",
    title: "শিরোনাম",
    close: "বন্ধ করুন",
    saveDeadline: "ডেডলাইন সংরক্ষণ করুন"
  }
};

// Helper
export function t(lang: Lang, key: string) {
  return translations[lang][key] ?? translations.en[key] ?? key;
}
