"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  ArrowLeft,
  Globe,
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  Loader,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { DataObjectBuilder } from "./_components/data-object-builder";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type TaskType = "scrape" | "summarize" | null;
type ScrapeType = "Single" | "Multiple" | null;
type SingleOutputFormat = "JSON" | "CSV" | "Google Sheets" | null;
type MultipleOutputFormat = "Vector DB" | "PostgreSQL" | null;
type SummaryLength = "short" | "medium" | "long";
type SummaryStyle = "informative" | "analytical" | "creative";

interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onSelect: () => void;
}

const TaskCard = ({
  icon,
  title,
  description,
  features,
  onSelect,
}: TaskCardProps) => (
  <Card className="glass-morphism border-white/10">
    <CardHeader className="pb-2">
      <div className="bg-ai-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <CardTitle className="text-white">{title}</CardTitle>
      <CardDescription className="text-white/70">{description}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-white/50">
      <ul className="mb-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Zap size={14} className="text-ai-primary mr-2" /> {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        className="w-full bg-white/10 text-white hover:bg-white/20"
        onClick={onSelect}
      >
        Select <ArrowRight size={16} className="ml-2" />
      </Button>
    </CardFooter>
  </Card>
);

const Dashboard = () => {
  const [taskType, setTaskType] = useState<TaskType>(null);
  const [scrapeType, setScrapeType] = useState<ScrapeType>(null);
  const [singleOutputFormat, setSingleOutputFormat] =
    useState<SingleOutputFormat>(null);
  const [multipleOutputFormat, setMultipleOutputFormat] =
    useState<MultipleOutputFormat>(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeUrls, setScrapeUrls] = useState<string[]>([""]);
  const [textToSummarize, setTextToSummarize] = useState("");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("informative");
  const [extractFields, setExtractFields] = useState<Record<string, any>>({});

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  console.log("extracted: ", extractFields);

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
    setLoading(true);

    if (taskType === "summarize") {
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: textToSummarize,
            length: summaryLength,
            style: summaryStyle,
          }),
        });

        if (!res.ok) throw new Error("Failed to summarize text");

        const data = await res.json();
        const transformed = {
          title: "Summary",
          timestamp: new Date().toISOString(),
          results: [
            {
              id: uuidv4(),
              content: data.summary,
            },
          ],
        };

        if (typeof window !== "undefined" && data.summary) {
          localStorage.setItem("summarizeResult", JSON.stringify(transformed));
          router.push("/result");
        } else {
          console.error("No summary found in API response");
        }
      } catch (error) {
        console.error("Error running summarize task:", error);
      }
    }

    if (taskType === "scrape") {
      try {
        const urls = scrapeType === "Multiple" ? scrapeUrls : [scrapeUrl];
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urls,
            type: scrapeType,
            fields: extractFields,
            outputFormat:
              scrapeType === "Multiple"
                ? multipleOutputFormat
                : singleOutputFormat,
          }),
        });

        if (!res.ok) throw new Error("Failed to scrape website");

        const result = await res.json();
        localStorage.setItem("summarizeResult", JSON.stringify(result));
        router.push("/result");
      } catch (error) {
        console.error("Error running scrape task:", error);
      }
    }

    setLoading(false);
  };

  const handleTaskSelect = useCallback((type: TaskType) => {
    setTaskType(type);
    setActiveTab("custom");
  }, []);

  const taskCards = [
    {
      icon: <Globe className="text-ai-primary" />,
      title: "Web Scraper",
      description: "Extract structured data from websites automatically.",
      features: [
        "Scrape tables, lists, and text",
        "Export as CSV, JSON, or Excel",
        "Handle pagination and authentication",
      ],
      onSelect: () => handleTaskSelect("scrape"),
    },
    {
      icon: <FileText className="text-ai-primary" />,
      title: "Text Summarizer",
      description: "Generate concise summaries from long documents.",
      features: [
        "Summarize documents and articles",
        "Adjust summary length and focus",
        "Maintain key information and context",
      ],
      onSelect: () => handleTaskSelect("summarize"),
    },
  ];

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
                  <TaskCard key={index} {...card} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom">
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
                      onValueChange={(value) => setTaskType(value as TaskType)}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Choose task" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-black">
                        <SelectItem value="scrape">Scrape Website</SelectItem>
                        <SelectItem value="summarize">
                          Summarize Text
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {taskType === "scrape" && (
                    <div className="space-y-6">
                      <div>
                        <label className="mb-1 block text-sm text-white/70">
                          Select Type
                        </label>
                        <Select
                          value={scrapeType ?? undefined}
                          onValueChange={(value) =>
                            setScrapeType(value as ScrapeType)
                          }
                        >
                          <SelectTrigger className="border-white/10 bg-white/5 text-white">
                            <SelectValue placeholder="Choose type" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-black">
                            <SelectItem value="Single">Single Page</SelectItem>
                            <SelectItem value="Multiple">
                              Multiple Pages
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {scrapeType === "Single" ? (
                        <>
                          <div>
                            <label className="mb-1 block text-sm text-white/70">
                              Website URL
                            </label>
                            <Input
                              value={scrapeUrl}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setScrapeUrl(e.target.value)
                              }
                              placeholder="https://example.com"
                              className="border-white/10 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-white/70">
                              Output Format
                            </label>
                            <Select
                              value={singleOutputFormat ?? undefined}
                              onValueChange={(value) =>
                                setSingleOutputFormat(
                                  value as SingleOutputFormat,
                                )
                              }
                            >
                              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                <SelectValue placeholder="Select output format" />
                              </SelectTrigger>
                              <SelectContent className="border-white/10 bg-black">
                                <SelectItem value="JSON">JSON</SelectItem>
                                <SelectItem value="CSV">CSV</SelectItem>
                                <SelectItem value="Google Sheets">
                                  Google Sheets
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : scrapeType === "Multiple" ? (
                        <>
                          <div className="space-y-4">
                            <label className="mb-1 block text-sm text-white/70">
                              Website URLs
                            </label>
                            {scrapeUrls.map((url, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={url}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                  ) => handleUrlChange(index, e.target.value)}
                                  placeholder="https://example.com"
                                  className="border-white/10 bg-white/5 text-white"
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
                              onValueChange={(value) =>
                                setMultipleOutputFormat(
                                  value as MultipleOutputFormat,
                                )
                              }
                            >
                              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                <SelectValue placeholder="Select output format" />
                              </SelectTrigger>
                              <SelectContent className="border-white/10 bg-black">
                                <SelectItem value="Vector DB">
                                  Vector DB
                                </SelectItem>
                                <SelectItem value="PostgreSQL">
                                  PostgreSQL
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : null}

                      <div className="mt-6">
                        <label className="mb-1 block text-sm text-white/70">
                      Select Fields
                        </label>
                        <DataObjectBuilder onObjectChange={setExtractFields} />
                      </div>
                    </div>
                  )}

                  {taskType === "summarize" && (
                    <div className="space-y-6">
                      <div>
                        <label className="mb-1 block text-sm text-white/70">
                          Text to Summarize
                        </label>
                        <Textarea
                          value={textToSummarize}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setTextToSummarize(e.target.value)
                          }
                          placeholder="Paste or type your text here..."
                          className="h-32 resize-none border-white/10 bg-white/5 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm text-white/70">
                            Summary Length
                          </label>
                          <Select
                            value={summaryLength}
                            onValueChange={(value: SummaryLength) =>
                              setSummaryLength(value)
                            }
                          >
                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent className="bg-ai-dark border-white/10">
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="long">Long</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-white/70">
                            Summary Style
                          </label>
                          <Select
                            value={summaryStyle}
                            onValueChange={(value: SummaryStyle) =>
                              setSummaryStyle(value)
                            }
                          >
                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent className="bg-ai-dark border-white/10">
                              <SelectItem value="informative">
                                Informative
                              </SelectItem>
                              <SelectItem value="analytical">
                                Analytical
                              </SelectItem>
                              <SelectItem value="creative">Creative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                      <div className="flex items-center justify-center">
                        <Loader className="mr-2" size={16} /> Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="mr-2" size={16} /> Submit Task
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <div className="glass-morphism rounded-lg border-white/10 p-6 text-center">
                <p className="text-white/70">
                  You haven't generated any results yet.
                </p>
                <Button
                  className="mt-4 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setActiveTab("categories")}
                >
                  Start your first task
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
