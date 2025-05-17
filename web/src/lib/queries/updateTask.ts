import { supabase } from "../supabase";

export const updateTask = async (
  userId: string,
  token: string,
  taskId: string,
  status: "running" | "success" | "error" | "idle",
  data?: string,
) => {
  const client = await supabase(token);

  const { data: result, error } = await client
    .from("tasks")
    .update({
      status,
      data,
    })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return result;
};
