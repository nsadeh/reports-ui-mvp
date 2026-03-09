export interface Analyst {
  name: string;
  title: string;
  credentials: string;
}

export interface ReportMeta {
  id: string;
  title: string;
  scope_type: "target_area" | "disease_area" | "indication";
  scope_value: string;
  report_type: "scheduled" | "custom";
  delivery_date: string;
  analyst: Analyst;
  status: "delivered" | "in_progress" | "scheduled";
  next_scheduled: string | null;
  drugs_covered: string[];
  indications_covered: string[];
  payers_covered: string[];
  tags: string[];
}

export interface MonitoredTarget {
  target: string;
  tracked_drugs: number;
  tracked_indications: number;
  last_report_date: string | null;
  status: "new_report" | "up_to_date" | "coming_soon";
  active: boolean;
}

export interface DashboardData {
  monitored_targets: MonitoredTarget[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface QAFallbackPair {
  question: string;
  answer: string;
  keywords: string[];
}
