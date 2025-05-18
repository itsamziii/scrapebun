"use client";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase/client";
import { CodeBlock } from "./_components/code-block";
import { Copy } from "lucide-react";
import type { Database } from "~/database.types";

export default function ResultsPage() {
  const { taskId } = useParams();
  const { session } = useSession();
  const [isCopied, setIsCopied] = useState(false);
  const [result, setResult] = useState<
    Database["public"]["Functions"]["get_task_data"]["Returns"] | null
  >(null);
  const [error, setError] = useState<unknown>(null);

  const supabaseClient = useMemo(() => {
    if (!session) return null;
    return createClerkSupabaseClient(session);
  }, [session]);

  useEffect(() => {
    if (!supabaseClient) return;
    const fetchResult = async () => {
      const { data } = await supabaseClient.rpc("get_task_data", {
        task_uuid: taskId as string,
      });

      if (error) {
        setError(error);
        return;
      }

      setResult(data);
    };

    void fetchResult();
  }, [error, supabaseClient, taskId]);

  if (!result) return <div>Loading...</div>;

  const data = result[0];

  if (error || !data) {
    return notFound();
  }

  const language = data.task_scrape_type === "single" ? "json" : "csv";
  const filename =
    data.task_scrape_type === "single" ? "data.json" : "data.csv";
  const code =
    data.task_scrape_type === "single"
      ? data.single_result.data_json
      : data.single_result.data_csv;

  const handleCopy = () => {
    void navigator.clipboard.writeText(taskId as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Scrape Results</h1>
        <Link href="/dashboard">
          <Button variant="outline" className="text-white">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70">Task ID</p>
              <p className="text-white">{data.task_id}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Status</p>
              <p className="text-white">{data.task_status}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Scrape Type</p>
              <p className="text-white capitalize">
                {data.task_scrape_type || "unknown"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.task_scrape_type === "single" ? (
        <Card className="mt-6 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Response Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="csv">CSV</TabsTrigger>
              </TabsList>
              <TabsContent value={language}>
                <CodeBlock
                  language={language}
                  filename={filename}
                  code={JSON.stringify(code)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 text-white/70">
          <p>To view the data, visit the MCP server and use the Task ID:</p>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-gray-800 p-2 font-mono text-white">
              {taskId}
            </span>
            <Button variant="outline" onClick={handleCopy}>
              {isCopied ? (
                "Copied"
              ) : (
                <>
                  <Copy className="mr-2" size={16} /> Copy Task ID
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
