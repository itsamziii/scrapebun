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
import { Loader, Sparkles, Plus, X } from "lucide-react";
import type { MultipleOutputFormat, ScrapeType } from "../../../lib/types";
import type { TaskType } from "../../../lib/types";
import type { ChangeEvent } from "react";
import type { SingleOutputFormat } from "../../../lib/types";
import { DataObjectBuilder } from "./data-object-builder";

interface CustomInputCardProps {
  taskType: TaskType;
  scrapeUrl: string;
  scrapeUrls: string[];
  scrapeType: ScrapeType;
  singleOutputFormat: SingleOutputFormat;
  multipleOutputFormat: MultipleOutputFormat;
  setTaskType: (type: TaskType) => void;
  setScrapeUrl: (url: string) => void;
  setExtractFields: (fields: Record<string, any>) => void;
  setSingleOutputFormat: (format: SingleOutputFormat) => void;
  setMultipleOutputFormat: (format: MultipleOutputFormat) => void;
  handleUrlChange: (index: number, url: string) => void;
  handleAddUrl: () => void;
  handleRemoveUrl: (index: number) => void;
  handleRunTask: () => void;
  loading: boolean;
}

export const CustomInputCard: React.FC<CustomInputCardProps> = ({
  taskType,
  scrapeUrl,
  scrapeUrls,
  scrapeType,
  singleOutputFormat,
  multipleOutputFormat,
  setTaskType,
  setScrapeUrl,
  setExtractFields,
  setMultipleOutputFormat,
  handleUrlChange,
  handleAddUrl,
  handleRemoveUrl,
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

  const handleUrlInputChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      handleUrlChange(index, e.target.value);
    },
    [handleUrlChange],
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
              <SelectItem value="multiple">Multiple Pages Scrape</SelectItem>
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
                Website URLs
              </label>
              {scrapeUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => handleUrlInputChange(index, e)}
                    placeholder="https://example.com"
                    className="border-white/10 bg-white/5 text-white"
                    required
                  />
                  {scrapeUrls.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUrl(index)}
                      className="text-white/70 hover:text-white"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddUrl}
                className="border-white/10 bg-white/5 text-white hover:bg-white/20"
              >
                <Plus size={16} className="mr-2" /> Add URL
              </Button>
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
            <DataObjectBuilder onObjectChange={handleExtractFieldsChange} />
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
