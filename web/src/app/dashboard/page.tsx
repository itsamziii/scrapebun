"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import { handleMultipleScrape } from "./_actions";
import { handleSingleScrape } from "./_actions";

const Dashboard = () => {
  const router = useRouter();

  const {
    userId,
    scrapeHistory,
    loading,
    supabaseClient,
    setScrapeHistory,
    setLoading,
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
    if (!supabaseClient) {
      toast.error("Please login to continue");
      router.push("/sign-in");
      return;
    }

    if (!taskType) {
      toast.error("Please select a task type");
      return;
    }

    if (!scrapeUrl) {
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

    try {
      let result;
      if (taskType === "single") {
        result = await handleSingleScrape(
          supabaseClient,
          userId!,
          {
            scrapeUrl,
            instruction,
            extractFields,
            outputFormat,
          },
          setScrapeHistory,
          setActiveTab,
        );
      } else {
        result = await handleMultipleScrape(
          supabaseClient,
          userId!,
          scrapeUrl,
          setScrapeHistory,
          setActiveTab,
        );
      }

      if (result.success) {
        await updateTaskStatus(
          result.taskData!.task_id,
          "success",
          JSON.stringify(result.taskData),
        );

        updateScrapeHistory(
          result.taskData!.task_id,
          "success",
          JSON.stringify(result.taskData),
        );
      } else {
        throw new Error(result.message ?? "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error running scrape task:", error);
      toast.error("Failed to run the scraping task");
    } finally {
      setLoading(false);
    }
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
