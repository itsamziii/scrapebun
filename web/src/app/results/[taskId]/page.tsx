"use client";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase/client";
import { CodeBlock } from "./_components/code-block";

export default async function ResultsPage() {
  const { taskId } = useParams();

  const { session } = useSession();

  const supabaseClient = useMemo(() => {
    if (!session) return null;
    return createClerkSupabaseClient(session);
  }, [session]);

  if (!supabaseClient) {
    throw new Error("Supabase client is not initialized");
  }

  const { data, error } = await supabaseClient
    .rpc("get_task_data", {
      task_uuid: taskId as string,
    })
    .single();

  if (error) {
    return notFound();
  }

  const language = data.task_scrape_type === "single" ? "json" : "csv";
  const filename =
    data.task_scrape_type === "single" ? "data.json" : "data.csv";
  const code =
    data.task_scrape_type === "single"
      ? data.single_result.data_json
      : data.single_result.data_csv;

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
        <div className="text-white/70">
          Multiple scrape results view coming soon...
        </div>
      )}
    </div>
  );
}
