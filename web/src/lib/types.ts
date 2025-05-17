export type TaskType = "single" | "multiple";
export type ScrapeType = "Single" | "Multiple" | null;
export type SingleOutputFormat = "JSON" | "CSV" | "Google Sheets" | null;
export type MultipleOutputFormat = "Vector DB" | "PostgreSQL" | null;
export type TaskStatus = "running" | "success" | "error" | "idle";

export interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onSelect: () => void;
}

export interface TaskHistory {
  id: string;
  type: "single" | "multiple";
  user_id: string;
  created: string;
  status: TaskStatus;
  data: string | null;
}
export type PropertyType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  value: string | number | boolean | null | Record<string, unknown> | unknown[];
  parentId?: string;
  properties?: Property[];
  items?: Property[];
  arrayItemType?: PropertyType;
}
