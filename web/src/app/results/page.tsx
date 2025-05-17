"use client";
import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ArrowLeft, Check, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "~/components/ui/use-toast";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";

interface MetricData {
  id: number;
  name: string;
  value: number;
  trend: "increasing" | "stable" | "decreasing";
}

interface AnalysisResult {
  title: string;
  data: MetricData[];
  summary: string;
}

interface MetricCardProps {
  name: string;
  value: number;
  trend: MetricData["trend"];
}

const MetricCard = ({ name, value, trend }: MetricCardProps) => (
  <div className="rounded-md bg-white/5 p-3">
    <div className="flex justify-between">
      <span className="text-white">{name}</span>
      <span className="text-ai-primary">{value}</span>
    </div>
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="bg-ai-primary h-full rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
    <div className="mt-1 text-xs text-white/50">Trend: {trend}</div>
  </div>
);

const Results = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (text: string) => {
      void navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Result has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    },
    [toast],
  );

  const mockResult: AnalysisResult = {
    title: "Analysis Results",
    data: [
      {
        id: 1,
        name: "Product Insights",
        value: 78.5,
        trend: "increasing",
      },
      {
        id: 2,
        name: "User Engagement",
        value: 92.3,
        trend: "stable",
      },
      {
        id: 3,
        name: "Market Position",
        value: 65.7,
        trend: "increasing",
      },
    ],
    summary:
      "Overall positive trends observed across key metrics. User engagement remains highest performing indicator.",
  };

  const formatRawOutput = useCallback((result: AnalysisResult) => {
    return `${result.title}\n${result.data
      .map((metric) => `${metric.name}: ${metric.value} (${metric.trend})`)
      .join("\n")}\nSummary: ${result.summary}`;
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Button variant="ghost" size="sm" className="text-white/70" asChild>
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">Results</h1>
            <p className="text-white/70">
              Here&apos;s what our AI agent found for you.
            </p>
          </div>

          <Card className="glass-morphism mb-8 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Generated Output</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() =>
                    void handleCopy(JSON.stringify(mockResult, null, 2))
                  }
                >
                  {copied ? (
                    <Check className="mr-1 h-4 w-4" />
                  ) : (
                    <Copy className="mr-1 h-4 w-4" />
                  )}
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="mb-4 bg-white/5">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="rounded-md bg-white/5 p-4">
                    <h3 className="mb-3 text-xl text-white">
                      {mockResult.title}
                    </h3>

                    <div className="space-y-4">
                      {mockResult.data.map((metric) => (
                        <MetricCard
                          key={metric.id}
                          name={metric.name}
                          value={metric.value}
                          trend={metric.trend}
                        />
                      ))}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h4 className="mb-2 text-sm text-white/70">Summary</h4>
                      <p className="text-white">{mockResult.summary}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="json">
                  <pre className="overflow-x-auto rounded-md bg-white/5 p-4 text-sm text-white/80">
                    {JSON.stringify(mockResult, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="raw">
                  <div className="overflow-x-auto rounded-md bg-white/5 p-4">
                    <p className="whitespace-pre-wrap text-white/80">
                      {formatRawOutput(mockResult)}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <Button
              variant="outline"
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="/dashboard">Try Another Task</Link>
            </Button>

            <Button
              className="bg-ai-primary hover:bg-ai-secondary w-full text-white sm:w-auto"
              asChild
            >
              <Link href="/dashboard" className="flex items-center">
                Next Step <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
