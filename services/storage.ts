import type { AdmissionEvent, StudySession, Subject, Todo, Deadline } from "../types";

const KEYS = {
  EVENTS: "adm_events",
  STUDY: "adm_study",
  SUBJECTS: "adm_subjects",
  TODOS: "adm_todos",
  DEADLINES: "adm_deadlines",
  THEME: "adm_theme",
  LANG: "adm_lang",
};
export const Storage = {
  getEvents: (): AdmissionEvent[] =>
    JSON.parse(localStorage.getItem(KEYS.EVENTS) || "[]"),
  saveEvents: (data: AdmissionEvent[]) =>
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(data)),

  getStudy: (): StudySession[] =>
    JSON.parse(localStorage.getItem(KEYS.STUDY) || "[]"),
  saveStudy: (data: StudySession[]) =>
    localStorage.setItem(KEYS.STUDY, JSON.stringify(data)),

  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(KEYS.SUBJECTS);
    if (!data) return [{ id: "1", name: "General", color: "#6366f1" }];
    return JSON.parse(data);
  },
  saveSubjects: (data: Subject[]) =>
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(data)),

  getTodos: (): Todo[] =>
    JSON.parse(localStorage.getItem(KEYS.TODOS) || "[]"),
  saveTodos: (data: Todo[]) =>
    localStorage.setItem(KEYS.TODOS, JSON.stringify(data)),

  getDeadlines: (): Deadline[] =>
    JSON.parse(localStorage.getItem(KEYS.DEADLINES) || "[]"),
  saveDeadlines: (data: Deadline[]) =>
    localStorage.setItem(KEYS.DEADLINES, JSON.stringify(data)),

  getTheme: (): "light" | "dark" =>
    (localStorage.getItem(KEYS.THEME) as "light" | "dark") || "light",
  setTheme: (t: "light" | "dark") => localStorage.setItem(KEYS.THEME, t),

  getLang: (): "en" | "bn" =>
    (localStorage.getItem(KEYS.LANG) as "en" | "bn") || "en",
  setLang: (l: "en" | "bn") => localStorage.setItem(KEYS.LANG, l),
};
