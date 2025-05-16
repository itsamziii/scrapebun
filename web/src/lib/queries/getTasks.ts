"use client";

import { supabase } from "../supabase";

export const getAllTasks = async (userId: string, token: string) => {
  const client = await supabase(token);

  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
