export type Lang = "en" | "bn";

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar / Menu
    dashboard: "Dashboard",
    studyTracker: "Study Tracker",
    myCalendar: "My Calendar",
    deadlines: "Deadlines",
    menu: "Menu",
    about: "About",
    settings: "Settings",
    theme: "Theme",
    language: "Language",

    // Common actions
    addEvent: "Add Event",
    editEvent: "Edit Event",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    today: "Today",
    back: "Back",
    backToDashboard: "Back to Dashboard",
    backToResults: "Back to Results",
    confirm: "Confirm",

    // Home/Dashboard
    search: "Search events...",
    month: "Month",
    category: "Category",
    latestNews: "Latest News",
    latestAlerts: "Latest Alerts",
    noAnnouncements: "No recent announcements",
    noData: "No data yet",

    // Table headings
    university: "University",
    examDate: "Exam Date",
    timeLeft: "Time Left",

    // Event fields
    eligibility: "Eligibility",
    website: "Website",
    admitCard: "Admit Card",
    notes: "Notes",
    date: "Date",
    title: "Title",

    // Time / Time slot
    time: "Time",
    startTime: "Start time",
    endTime: "End time",
    timeNotSet: "Time not set",
    setTime: "Set time",
    addTime: "Add time",
    updateTime: "Update time",

    // Status text
    examHasEnded: "Exam has ended",
    timeUp: "Time Up",
    comingSoon: "Coming Soon",
    downloadAvailable: "Download Available",

    // Confirmations / messages
    confirmDeleteEvent: "Delete this event?",
    confirmDeleteDeadline: "Delete this deadline?",
    viewDetails: "View Details",
    eventNotFound: "Event not found",
    loading: "Loading...",

    // Study tracker
    todayStudy: "Today Study",
    thisWeek: "This Week",
    mins: "mins",
    addSession: "Add Session",
    subject: "Subject",

    // Deadlines
    addDeadline: "Add Deadline",
    newDeadline: "New Deadline",
    priority: "Priority",
    daysLeft: "Days left",
    saveDeadline: "Save Deadline",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Footer / Contact / Download
    telegram: "Telegram",
    facebookPage: "Facebook Page",
    contactMail: "E-mail",
    downloadApp: "Download App",
    downloadPdf: "Download PDF",
    downloadExcel: "Download Excel",
    privacy: "Privacy",

    // Misc / Labels
    admissionPortal: "Admission Portal",
    importantNotes: "Important Notes",
    eligibilityRequirements: "Eligibility & Requirements"
  },

  bn: {
    // Navbar / Menu
    dashboard: "ড্যাশবোর্ড",
    studyTracker: "স্টাডি ট্র্যাকার",
    myCalendar: "আমার ক্যালেন্ডার",
    deadlines: "ডেডলাইন",
    menu: "মেনু",
    about: "পরিচিতি",
    settings: "সেটিংস",
    theme: "থিম",
    language: "ভাষা",

    // Common actions
    addEvent: "ইভেন্ট যোগ করুন",
    editEvent: "ইভেন্ট সম্পাদনা",
    delete: "ডিলিট",
    view: "দেখুন",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    close: "বন্ধ করুন",
    today: "আজ",
    back: "ফিরে যান",
    backToDashboard: "ড্যাশবোর্ডে ফিরুন",
    backToResults: "রেজাল্টে ফিরুন",
    confirm: "নিশ্চিত করুন",

    // Home/Dashboard
    search: "ইভেন্ট খুঁজুন...",
    month: "মাস",
    category: "ক্যাটাগরি",
    latestNews: "সর্বশেষ খবর",
    latestAlerts: "সর্বশেষ নোটিশ",
    noAnnouncements: "সাম্প্রতিক কোনো ঘোষণা নেই",
    noData: "এখনও কোনো তথ্য যোগ করা হয়নি",

    // Table headings
    university: "বিশ্ববিদ্যালয়",
    examDate: "পরীক্ষার তারিখ",
    timeLeft: "সময় বাকি",

    // Event fields
    eligibility: "যোগ্যতা",
    website: "ওয়েবসাইট",
    admitCard: "অ্যাডমিট কার্ড",
    notes: "নোট",
    date: "তারিখ",
    title: "শিরোনাম",

    // Time / Time slot
    time: "সময়",
    startTime: "শুরুর সময়",
    endTime: "শেষ সময়",
    timeNotSet: "সময় সেট করা হয়নি",
    setTime: "সময় সেট করুন",
    addTime: "সময় যোগ করুন",
    updateTime: "সময় আপডেট করুন",

    // Status text
    examHasEnded: "পরীক্ষা শেষ হয়েছে",
    timeUp: "সময় শেষ",
    comingSoon: "শিগগিরই আসছে",
    downloadAvailable: "ডাউনলোড করা যাবে",

    // Confirmations / messages
    confirmDeleteEvent: "আপনি কি ইভেন্টটি ডিলিট করতে চান?",
    confirmDeleteDeadline: "আপনি কি ডেডলাইনটি ডিলিট করতে চান?",
    viewDetails: "বিস্তারিত দেখুন",
    eventNotFound: "ইভেন্ট পাওয়া যায়নি",
    loading: "লোড হচ্ছে...",

    // Study tracker
    todayStudy: "আজকের পড়া",
    thisWeek: "এই সপ্তাহ",
    mins: "মিনিট",
    addSession: "সেশন যোগ করুন",
    subject: "বিষয়",

    // Deadlines
    addDeadline: "ডেডলাইন যোগ করুন",
    newDeadline: "নতুন ডেডলাইন",
    priority: "অগ্রাধিকার",
    daysLeft: "দিন বাকি",
    saveDeadline: "ডেডলাইন সংরক্ষণ করুন",
    high: "উচ্চ",
    medium: "মাঝারি",
    low: "কম",

    // Footer / Contact / Download
    telegram: "টেলিগ্রাম",
    facebookPage: "ফেসবুক পেজ",
    contactMail: "ই-মেইল",
    downloadApp: "অ্যাপ ডাউনলোড",
    downloadPdf: "পিডিএফ ডাউনলোড",
    downloadExcel: "এক্সেল ডাউনলোড",
    privacy: "প্রাইভেসি",

    // Misc / Labels
    admissionPortal: "অ্যাডমিশন পোর্টাল",
    importantNotes: "বিশেষ দ্রষ্টব্য",
    eligibilityRequirements: "যোগ্যতা ও শর্তাবলী"
  }
};

// Helper
export function t(lang: Lang, key: string) {
  return translations[lang]?.[key] ?? translations.en?.[key] ?? key;
}
