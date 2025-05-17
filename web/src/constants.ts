import type { TaskType } from "./lib/types";
import { TaskIcons } from "./app/dashboard/_components/task-icons";

export const taskCards = [
  {
    icon: TaskIcons.single,
    title: "Web Scraper Single Page",
    description: "Extract structured data from websites automatically.",
    features: [
      "Scrape tables, lists, and text",
      "Export as CSV, JSON, or Excel",
      "Handle pagination and authentication",
    ],
    type: "single" as TaskType,
  },
  {
    icon: TaskIcons.multiple,
    title: "Domain Wide Scraper",
    description: "Scrape multiple pages of a website automatically.",
    features: [
      "Scrape tables, lists, and text",
      "Export as Vector DB or PostgreSQL, ",
      "Handle pagination and authentication",
    ],
    type: "multiple" as TaskType,
  },
];
