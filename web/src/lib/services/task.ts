import { type SupabaseClient } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "~/database.types";

export async function getTasks(
  client: SupabaseClient,
): Promise<Tables<"tasks">[]> {
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .overrideTypes<Tables<"tasks">[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTask(
  client: SupabaseClient,
  task: TablesInsert<"tasks">,
): Promise<Tables<"tasks">> {
  const { data, error } = await client
    .from("tasks")
    .insert(task)
    .select("*")
    .single()
    .overrideTypes<Tables<"tasks">>();

  if (error) {
    throw new Error(error?.message);
  }

  return data as Tables<"tasks">;
}

export async function updateTask(
  client: SupabaseClient,
  taskId: string,
  status: Tables<"tasks">["status"],
): Promise<Tables<"tasks">> {
  const { data, error } = await client
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select("*")
    .single()
    .overrideTypes<Tables<"tasks">>();

  if (error) {
    throw new Error(error.message);
  }

  return data as Tables<"tasks">;
}

export async function getTask(
  client: SupabaseClient,
  taskId: string,
): Promise<Tables<"tasks"> | null> {
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single()
    .overrideTypes<Tables<"tasks">>();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Tables<"tasks">;
}
