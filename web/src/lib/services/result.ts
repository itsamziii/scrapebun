import { type SupabaseClient } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "~/database.types";

export async function createSingleScrapeResult(
  client: SupabaseClient,
  result: TablesInsert<"single_scrape_results">,
): Promise<boolean> {
  const { error } = await client.from("single_scrape_results").insert(result);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function createMultipleScrapeResults(
  client: SupabaseClient,
  results: TablesInsert<"multiple_scrape_results">[],
): Promise<boolean> {
  const { error } = await client
    .from("multiple_scrape_results")
    .insert(results);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getMultipleScrapeResults(
  client: SupabaseClient,
): Promise<Tables<"multiple_scrape_results">[]> {
  const { data, error } = await client
    .from("multiple_scrape_results")
    .select("*")
    .overrideTypes<Tables<"multiple_scrape_results">[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMultipleScrapeResult(
  client: SupabaseClient,
  result: TablesInsert<"multiple_scrape_results">,
): Promise<Tables<"multiple_scrape_results">> {
  const { data, error } = await client
    .from("multiple_scrape_results")
    .insert(result)
    .select("*")
    .single()
    .overrideTypes<Tables<"multiple_scrape_results">>();

  if (error) {
    throw new Error(error?.message);
  }

  return data as Tables<"multiple_scrape_results">;
}

export async function updateMultipleScrapeResult(
  client: SupabaseClient,
  taskId: string,
  updateData: Partial<Tables<"multiple_scrape_results">>,
): Promise<Tables<"multiple_scrape_results">> {
  const { data, error } = await client
    .from("multiple_scrape_results")
    .update(updateData)
    .eq("task_id", taskId)
    .select("*")
    .single()
    .overrideTypes<Tables<"multiple_scrape_results">>();

  if (error) {
    throw new Error(error.message);
  }

  return data as Tables<"multiple_scrape_results">;
}

export async function getMultipleScrapeResult(
  client: SupabaseClient,
  taskId: string,
): Promise<Tables<"multiple_scrape_results"> | null> {
  const { data, error } = await client
    .from("multiple_scrape_results")
    .select("*")
    .eq("task_id", taskId)
    .single()
    .overrideTypes<Tables<"multiple_scrape_results">>();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Tables<"multiple_scrape_results">;
}
