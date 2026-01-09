export type TimeSlot = { start: string; end?: string; note?: string };

const TIME_SLOTS_KEY = "adm_event_time_slots_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadAllTimeSlots(): Record<string, TimeSlot> {
  return safeParse<Record<string, TimeSlot>>(
    localStorage.getItem(TIME_SLOTS_KEY),
    {}
  );
}

export function getTimeSlot(eventId: string): TimeSlot | undefined {
  const all = loadAllTimeSlots();
  return all[eventId];
}

export function setTimeSlot(eventId: string, slot: TimeSlot) {
  const all = loadAllTimeSlots();
  all[eventId] = slot;
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(all));
}

export function removeTimeSlot(eventId: string) {
  const all = loadAllTimeSlots();
  delete all[eventId];
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(all));
}
