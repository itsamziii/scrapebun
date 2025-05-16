import { z } from "zod";

export const urlSchema = z.string().url("Please enter a valid URL");

export const taskSchema = z.object({
  taskType: z.enum(["single", "multiple"]),
  urls: z.array(z.string().url("Please enter a valid URL")),
  fields: z.record(z.any()),
  outputFormat: z.string(),
});
