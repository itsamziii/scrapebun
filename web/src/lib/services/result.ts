import { type SupabaseClient } from "@supabase/supabase-js";
import type { TablesInsert } from "~/database.types";

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
