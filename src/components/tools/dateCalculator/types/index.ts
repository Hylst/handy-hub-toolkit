
export interface DateResult {
  total: string;
  detailed: string;
  exact: number;
  breakdown: {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface AgeResult {
  primary: string;
  details: string;
  milestones: string[];
  nextBirthday: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  type: "meeting" | "deadline" | "reminder" | "event" | "birthday" | "anniversary";
  priority: "low" | "medium" | "high";
  description?: string;
  location?: string;
}

export interface TimeZone {
  name: string;
  label: string;
  offset: string;
}

export interface CalculationHistoryEntry {
  id: string;
  type: string;
  calculation: string;
  result: string;
  timestamp: Date;
}
