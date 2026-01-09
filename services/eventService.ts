import { AdmissionEvent, Category } from '../types';
import { STORAGE_KEY, DEMO_DATA } from '../constants';

export const getEvents = (): AdmissionEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
    return DEMO_DATA as AdmissionEvent[];
  }
  return JSON.parse(stored);
};

export const saveEvent = (event: Omit<AdmissionEvent, 'id'>, id?: string): AdmissionEvent => {
  const events = getEvents();
  let newEvent: AdmissionEvent;

  if (id) {
    const index = events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    newEvent = { ...event, id };
    events[index] = newEvent;
  } else {
    newEvent = { ...event, id: crypto.randomUUID() };
    events.push(newEvent);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return newEvent;
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getEventById = (id: string): AdmissionEvent | undefined => {
  const events = getEvents();
  return events.find(e => e.id === id);
};
