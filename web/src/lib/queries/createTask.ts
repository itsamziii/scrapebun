"use client";

import { useAuth } from "@clerk/nextjs";
import { supabase } from "../supabase";
import type { TaskType } from "~/lib/types";

export const createTask = async (
  userId: string,
  token: string,
  taskType: TaskType,
) => {
  const client = await supabase(token);

  const { data, error } = await client
    .from("tasks")
    .insert({
      user_id: userId,
      type: taskType,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
