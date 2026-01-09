export type Category = "Admission" | "Exam" | "Result" | "Admit Card" | "Other";

export interface AdmissionEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  eligibility: string;
  websiteLink: string;
  admitCardLink: string;
  notes?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  minutes: number;
  notes: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  date: string;
  text: string;
  completed: boolean;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  priority: "low" | "medium" | "high";
}

export interface AppState {
  theme: "light" | "dark";
  lang: "en" | "bn";
}
