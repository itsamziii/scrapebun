"use client";
import React from "react";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "~/database.types";
import { createTask } from "~/lib/services/task";
import { createMultipleScrapeResult } from "~/lib/services/result";

interface APIResult<T> {
  message?: string;
  taskData?: T;
  success: boolean;
}

interface CrawlResult {
  message: string;
  task_id: string;
  response: Record<string, unknown>[] | string;
}

interface ProcessedChunk {
  embedding: number[];
  text: string;
  chunk_number: number;
  title: string;
  url: string;
}

interface DomainCrawlResult {
  task_id: string;
  success: boolean;
  output: ProcessedChunk[][];
}

export async function handleSingleScrape(
  supabase: SupabaseClient,
  userId: string,
  options: {
    scrapeUrl: string;
    instruction: string;
    extractFields: Record<string, unknown>;
    outputFormat: string;
  },
  setScrapeHistory: React.Dispatch<React.SetStateAction<Tables<"tasks">[]>>,
  setActiveTab: (tab: string) => void,
): Promise<APIResult<CrawlResult>> {
  try {
    const task = await createTask(supabase, {
      scrape_type: "single",
      status: "running",
    });

    setScrapeHistory((prev: Tables<"tasks">[]) => [
      ...prev,
      {
        id: task.id,
        user_id: userId,
        scrape_type: "single",
        created: new Date().toISOString(),
        status: "running",
      } as Tables<"tasks">,
    ]);

    setActiveTab("history");

    const res = await fetch("http://localhost:5000/api/crawl/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_id: task.id,
        url: options.scrapeUrl,
        instruction: options.instruction,
        data_schema: options.extractFields,
        output_type: options.outputFormat.toLowerCase(),
      }),
    });

    if (!res.ok) {
      throw new Error("Crawler failed to scrape.");
    }

    const crawlResult = (await res.json()) as CrawlResult;

    return {
      success: true,
      taskData: crawlResult,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occured while trying to scrape.",
    };
  }
}

// export async function handleMultipleScrape(
//   supabase: SupabaseClient,
//   userId: string,
//   scrapeUrl: string,
//   setScrapeHistory: React.Dispatch<React.SetStateAction<Tables<"tasks">[]>>,
//   setActiveTab: (tab: string) => void,
// ): Promise<APIResult<DomainCrawlResult>> {
//   try {
//     const sitemapRes = await fetch(
//       `http://localhost:5000/api/domain/sitemap?url=${encodeURIComponent(scrapeUrl)}`,
//       {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//     if (!sitemapRes.ok) {
//       throw new Error(
//         `Failed to fetch sitemap: ${sitemapRes.status} ${sitemapRes.statusText}`,
//       );
//     }

//     const sitemapData = (await sitemapRes.json()) as { urls: string[] };
//     const urls = sitemapData.urls;
//     if (!Array.isArray(urls) || urls.length === 0) {
//       throw new Error("No URLs found");
//     }

//     const task = await createTask(supabase, {
//       scrape_type: "multiple",
//       status: "running",
//     });

//     setScrapeHistory((prev: Tables<"tasks">[]) => [
//       ...prev,
//       {
//         id: task.id,
//         user_id: userId,
//         scrape_type: "multiple",
//         created: new Date().toISOString(),
//         status: "running",
//       } as Tables<"tasks">,
//     ]);

//     setActiveTab("history");

//     const payload = {
//       task_id: task.id,
//       urls,
//     };

//     const res = await fetch("http://localhost:5000/api/crawl/domain", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to start domain crawl");
//     }

//     const crawlResult = (await res.json()) as DomainCrawlResult;
//     return {
//       success: true,
//       taskData: crawlResult,
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       success: false,
//       message: "Failed to start domain crawl",
//     };
//   }
// }

export async function handleMultipleScrape(
  supabase: SupabaseClient,
  user_id: string,
  scrapeUrl: string,
  setScrapeHistory: React.Dispatch<
    React.SetStateAction<Tables<"multiple_scrape_results">[]>
  >,
  setActiveTab: (tab: string) => void,
): Promise<APIResult<DomainCrawlResult>> {
  try {
    const sitemapRes = await fetch(
      `http://localhost:5000/api/domain/sitemap?url=${encodeURIComponent(scrapeUrl)}`,
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

    const sitemapData = (await sitemapRes.json()) as { urls: string[] };
    const urls = sitemapData.urls;
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error("No URLs found");
    }

    const scrapeResult = await createMultipleScrapeResult(supabase, {
      task_id: user_id, // ye wala part dekh liyo jara
      chunk_number: 0,
      text: "Scraping initialized",
      created: new Date().toISOString(),
    });

    setScrapeHistory((prev: Tables<"multiple_scrape_results">[]) => [
      ...prev,
      scrapeResult,
    ]);

    setActiveTab("history");

    const payload = {
      task_id: scrapeResult.task_id,
      urls,
    };

    const res = await fetch("http://localhost:5000/api/crawl/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to start domain crawl");
    }

    const crawlResult = (await res.json()) as DomainCrawlResult;
    return {
      success: true,
      taskData: crawlResult,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Failed to start domain crawl",
    };
  }
}
