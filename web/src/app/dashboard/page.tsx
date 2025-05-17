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
  SingleOutputFormat,
  MultipleOutputFormat,
  TaskStatus,
} from "../../lib/types";
import TaskCard from "./_components/task-card";
import { createTask } from "~/lib/queries/createTask";
import { log } from "node:console";

const Dashboard = () => {
  const { getToken } = useAuth();
  const {
    userId,
    scrapeHistory,
    loading,
    scrapeStatus,
    setScrapeHistory,
    setLoading,
    setScrapeStatus,
    updateTaskStatus,
  } = useTask();

  const [instruction, setInstruction] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("single");
  const [singleOutputFormat, setSingleOutputFormat] =
    useState<SingleOutputFormat>("JSON");
  const [multipleOutputFormat, setMultipleOutputFormat] =
    useState<MultipleOutputFormat>("Vector DB");
  const [activeTab, setActiveTab] = useState("categories");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [extractFields, setExtractFields] = useState<Record<string, unknown>>(
    {},
  );

  const updateScrapeHistory = (
    taskId: string,
    status: TaskStatus,
    data: string | null = null,
  ) => {
    setScrapeHistory((prevHistory) =>
      prevHistory.map((task) =>
        task.id === taskId ? { ...task, status, data } : task,
      ),
    );
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

    const outputFormat =
      taskType === "multiple" ? multipleOutputFormat : singleOutputFormat;

    if (!outputFormat) {
      toast.error("Please select an output format");
      return;
    }

    if (taskType === "single" && Object.keys(extractFields).length === 0) {
      toast.error("Please specify at least one field to extract");
      return;
    }

    setLoading(true);
    setActiveTab("history");

    setScrapeStatus("running");

    let taskId = "";

    try {
      if (!userId || !token) {
        throw new Error("User ID or token not found");
      }

      /**
       * PEHLE CREATE TASK RUN KAR IDHAR USSE TASK ID LE
       * USKE BAAD USER KO HISTORY PAR REREDIRECT KARNA HAI
       */

      taskId = await createTask(userId, token, taskType);
      if (!taskId) {
        throw new Error("Failed to create task");
      }

      setScrapeHistory((prevHistory) => [
        ...prevHistory,
        {
          id: taskId,
          type: taskType,
          user_id: userId,
          created: new Date().toISOString(),
          status: "running",
          data: null,
        },
      ]);
      setActiveTab("history");
      let res;

      if (taskType === "single") {
        /**
         * > SINGLE SCRAPING TASK
         * AB YAHA API CALL KAR
         */

        const payload = {
          task_id: taskId,
          url: scrapeUrl,
          instruction: instruction,
          data_schema: extractFields,
          output_type: outputFormat.toLowerCase(),
        };
        res = await fetch("http://localhost:9999/api/crawl/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        // res = await fetch("/api/scrape", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     urls: scrapeUrl,
        //     type: taskType,
        //     instruction,
        //     fields: extractFields,
        //     outputFormat,
        //   }),
        // });
      } else {
        /**
         * > MULTIPLE SCRAPING TASK
         * AB YAHA API CALL KAR
         */
        const sitemapRes = await fetch(
          `/api/domain/sitemap?url=${encodeURIComponent(scrapeUrl)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!sitemapRes.ok) {
          throw new Error(
            `Failed to fetch sitemap: ${sitemapRes.status} ${sitemapRes.statusText}`,
          );
        }

        const sitemapData = await sitemapRes.json();
        const urls = sitemapData.urls;
        if (!Array.isArray(urls) || urls.length === 0) {
          throw new Error("No URLs found");
        }

        const payload = {
          urls,
          type: taskType,
        };

        res = await fetch("api/domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // res = await fetch("/api/scrape2", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     url: scrapeUrl,
        //     type: taskType,
        //     instruction,
        //     outputFormat,
        //   }),
        // });
      }

      if (!res.ok) throw new Error("Failed to scrape website");

      const result = (await res.json()) as Record<string, unknown>;
      console.log("result: ", result);

      setScrapeStatus("success");

      /**
       * AB UPDATE TASK STATUS KARNA HAI
       */

      await updateTaskStatus(taskId, "success", JSON.stringify(result));
      updateScrapeHistory(taskId, "success", JSON.stringify(result));
    } catch (error) {
      console.error("Error running scrape task:", error);
      setScrapeStatus("error");

      if (taskId)
        await updateTaskStatus(
          taskId,
          "error",
          error instanceof Error ? error.message : "Unknown error",
        );

      toast.error("Failed to run the scraping task");
    }
    setLoading(false);
  };

  const onTaskSelect = (type: TaskType) => {
    setTaskType(type);
    setActiveTab("custom");
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
                instruction={instruction}
                setInstruction={setInstruction}
                singleOutputFormat={singleOutputFormat}
                setTaskType={setTaskType}
                setScrapeUrl={setScrapeUrl}
                setExtractFields={setExtractFields}
                setSingleOutputFormat={setSingleOutputFormat}
                multipleOutputFormat={multipleOutputFormat}
                setMultipleOutputFormat={setMultipleOutputFormat}
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
