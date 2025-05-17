"use client";
import { useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader, Sparkles } from "lucide-react";
import type { MultipleOutputFormat } from "../../../lib/types";
import type { TaskType } from "../../../lib/types";
import type { SingleOutputFormat } from "../../../lib/types";
import { DataObjectBuilder } from "./data-object-builder";

interface CustomInputCardProps {
  taskType: TaskType;
  scrapeUrl: string;
  instruction: string;
  setInstruction: (instruction: string) => void;
  singleOutputFormat: SingleOutputFormat;
  multipleOutputFormat: MultipleOutputFormat;
  setTaskType: (type: TaskType) => void;
  setScrapeUrl: (url: string) => void;
  setExtractFields: (fields: Record<string, any>) => void;
  setSingleOutputFormat: (format: SingleOutputFormat) => void;
  setMultipleOutputFormat: (format: MultipleOutputFormat) => void;
  handleRunTask: () => void;
  loading: boolean;
}

export const CustomInputCard: React.FC<CustomInputCardProps> = ({
  taskType,
  scrapeUrl,
  instruction,
  setInstruction,
  singleOutputFormat,
  multipleOutputFormat,
  setTaskType,
  setScrapeUrl,
  setExtractFields,
  setMultipleOutputFormat,
  setSingleOutputFormat,
  handleRunTask,
  loading,
}) => {
  const handleTaskTypeChange = useCallback(
    (value: string) => {
      setTaskType(value as TaskType);
    },
    [setTaskType],
  );

  const handleSingleFormatChange = useCallback(
    (value: string) => {
      setSingleOutputFormat(value as SingleOutputFormat);
    },
    [setSingleOutputFormat],
  );

  const handleMultipleFormatChange = useCallback(
    (value: string) => {
      setMultipleOutputFormat(value as MultipleOutputFormat);
    },
    [setMultipleOutputFormat],
  );

  const handleExtractFieldsChange = useCallback(
    (object: Record<string, any>) => {
      setExtractFields(object);
    },
    [setExtractFields],
  );

  return (
    <Card className="glass-morphism border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Custom Input</CardTitle>
        <CardDescription className="text-white/70">
          Select a task type and provide relevant information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="mb-1 block text-sm text-white/70">
            Select Task
          </label>
          <Select
            value={taskType ?? undefined}
            onValueChange={handleTaskTypeChange}
          >
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Choose task" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-black">
              <SelectItem value="single">Single Page Scrape</SelectItem>
              <SelectItem value="multiple">Domain Wide Scrape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {taskType === "single" && (
          <div className="space-y-6">
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Website URL
              </label>
              <Input
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="https://example.com"
                className="border-white/10 bg-white/5 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Instruction
              </label>
              <Input
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter task-specific instructions"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Output Format
              </label>
              <Select
                value={singleOutputFormat ?? undefined}
                onValueChange={handleSingleFormatChange}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black">
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="Google Sheets">Google Sheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DataObjectBuilder onObjectChange={handleExtractFieldsChange} />
          </div>
        )}

        {taskType === "multiple" && (
          <div className="space-y-6">
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Website URL
              </label>
              <Input
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="https://example.com"
                className="border-white/10 bg-white/5 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Instruction
              </label>
              <Input
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter task-specific instructions"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Output Format
              </label>
              <Select
                value={multipleOutputFormat ?? undefined}
                onValueChange={handleMultipleFormatChange}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black">
                  <SelectItem value="Vector DB">Vector DB</SelectItem>
                  <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="bg-ai-primary hover:bg-ai-secondary w-full text-white"
          onClick={handleRunTask}
        >
          {loading ? (
            <Loader className="mr-2" size={16} />
          ) : (
            <Sparkles className="mr-2" size={16} />
          )}{" "}
          Submit Task
        </Button>
      </CardFooter>
    </Card>
  );
};
