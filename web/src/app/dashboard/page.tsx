"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { CustomInputCard } from "./_components/cutom-input";
import { ScrapeHistoryCard } from "./_components/task-history";
import { taskCards } from "../../constants";
import { useTask } from "../../hooks/useTask";
import type {
  TaskType,
  ScrapeType,
  SingleOutputFormat,
  MultipleOutputFormat,
} from "../../lib/types";
import TaskCard from "./_components/task-card";

const Dashboard = () => {
  const { getToken } = useAuth();
  const {
    userId,
    currentTaskId,
    scrapeHistory,
    loading,
    setLoading,
    setScrapeStatus,
    validateUrls,
    updateTaskStatus,
    handleTaskSelect,
  } = useTask();

  const [taskType, setTaskType] = useState<TaskType>(null);
  const [scrapeType, setScrapeType] = useState<ScrapeType>(null);
  const [singleOutputFormat, setSingleOutputFormat] =
    useState<SingleOutputFormat>(null);
  const [multipleOutputFormat, setMultipleOutputFormat] =
    useState<MultipleOutputFormat>(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeUrls, setScrapeUrls] = useState<string[]>([""]);
  const [extractFields, setExtractFields] = useState<Record<string, any>>({});

  const handleAddUrl = () => {
    setScrapeUrls([...scrapeUrls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    setScrapeUrls(scrapeUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...scrapeUrls];
    newUrls[index] = value;
    setScrapeUrls(newUrls);
  };

  const handleRunTask = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to continue");
      return;
    }
    if (!taskType) {
      toast.error("Please select a task type");
      return;
    }

    if (taskType === "single" && !scrapeUrl) {
      toast.error("Please enter a URL");
      return;
    }

    if (taskType === "multiple" && scrapeUrls.some((url) => !url)) {
      toast.error("Please fill in all URLs");
      return;
    }

    const urls = taskType === "multiple" ? scrapeUrls : [scrapeUrl];
    if (!validateUrls(urls)) {
      return;
    }

    const outputFormat =
      taskType === "multiple" ? multipleOutputFormat : singleOutputFormat;

    if (!outputFormat) {
      toast.error("Please select an output format");
      return;
    }

    if (Object.keys(extractFields).length === 0) {
      toast.error("Please specify at least one field to extract");
      return;
    }

    setLoading(true);
    setActiveTab("history");

    if (taskType === "single" || taskType === "multiple") {
      setScrapeStatus("running");

      try {
        if (!userId || !token) {
          throw new Error("User ID or token not found");
        }

        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urls,
            type: taskType === "multiple" ? "Multiple" : "Single",
            fields: extractFields,
            outputFormat,
          }),
        });

        if (!res.ok) throw new Error("Failed to scrape website");

        const result = await res.json();
        setScrapeStatus("success");
        if (currentTaskId) {
          await updateTaskStatus(
            currentTaskId,
            "success",
            JSON.stringify(result),
          );
        }
      } catch (error) {
        console.error("Error running scrape task:", error);
        setScrapeStatus("error");
        if (currentTaskId) {
          await updateTaskStatus(
            currentTaskId,
            "error",
            error instanceof Error ? error.message : "Unknown error",
          );
        }
        toast.error("Failed to run the scraping task");
      }
    }
    setLoading(false);
  };

  const onTaskSelect = (type: TaskType) => {
    setTaskType(type);
    setActiveTab("custom");
    setScrapeType(type === "single" ? "Single" : "Multiple");
    handleTaskSelect(type);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Button variant="ghost" size="sm" className="text-white/70" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/70">
              Select an AI agent or create a custom task to get started.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="glass-morphism mb-6 flex items-center justify-center">
              <TabsTrigger
                value="categories"
                className="relative flex-1 text-center after:absolute after:top-1/2 after:right-0 after:-translate-y-1/2 after:pl-4 after:text-gray-400 after:content-['|'] last:after:content-none"
              >
                Categories
              </TabsTrigger>

              <TabsTrigger
                value="custom"
                className="relative flex-1 text-center after:absolute after:top-1/2 after:right-0 after:-translate-y-1/2 after:pl-4 after:text-gray-400 after:content-['|'] last:after:content-none"
              >
                Custom Input
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="relative flex-1 text-center"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {taskCards.map((card, index) => (
                  <TaskCard
                    key={index}
                    {...card}
                    onSelect={() => onTaskSelect(card.type)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <CustomInputCard
                taskType={taskType}
                scrapeUrl={scrapeUrl}
                scrapeUrls={scrapeUrls}
                scrapeType={scrapeType}
                singleOutputFormat={singleOutputFormat}
                setTaskType={setTaskType}
                setScrapeUrl={setScrapeUrl}
                setExtractFields={setExtractFields}
                setSingleOutputFormat={setSingleOutputFormat}
                multipleOutputFormat={multipleOutputFormat}
                setMultipleOutputFormat={setMultipleOutputFormat}
                handleUrlChange={handleUrlChange}
                handleAddUrl={handleAddUrl}
                handleRemoveUrl={handleRemoveUrl}
                handleRunTask={handleRunTask}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="history">
              <ScrapeHistoryCard scrapeHistory={scrapeHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
