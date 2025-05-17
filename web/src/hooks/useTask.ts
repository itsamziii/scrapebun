import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";
import { updateTask, getTasks } from "~/lib/services/task";
import { taskSchema } from "~/lib/validators";
import type { TaskStatus } from "~/lib/types";
import { createClerkSupabaseClient } from "~/lib/supabase/client";
import type { Tables } from "~/database.types";

export const useTask = () => {
  const { session } = useSession();

  const supabaseClient = useMemo(() => {
    if (!session) return null;
    return createClerkSupabaseClient(session);
  }, [session]);

  const [scrapeHistory, setScrapeHistory] = useState<Tables<"tasks">[]>([]);
  const [loading, setLoading] = useState(false);

  const validateUrls = useCallback((urls: string[]) => {
    try {
      taskSchema.shape.urls.parse(urls);
      return true;
    } catch (error) {
      console.error("Error validating URLs:", error);
      toast.error("Please enter valid URLs");
      return false;
    }
  }, []);

  const fetchTaskHistory = useCallback(async () => {
    if (!supabaseClient) return;

    try {
      const tasks = await getTasks(supabaseClient);
      if (tasks) setScrapeHistory(tasks);
    } catch (error) {
      console.error("Error fetching task history:", error);
      toast.error("Failed to load tasks");
    }
  }, [supabaseClient]);

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus, data?: string) => {
      if (!supabaseClient) return;

      try {
        await updateTask(supabaseClient, taskId, status);

        setScrapeHistory((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, status, ...(data && { data }) }
              : task,
          ),
        );
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      }
    },
    [supabaseClient],
  );

  useEffect(() => {
    if (!session || !supabaseClient) return;
    void fetchTaskHistory();
  }, [session, supabaseClient, fetchTaskHistory]);

  return {
    userId: session?.user.id,
    supabaseClient,
    scrapeHistory,
    loading,
    setScrapeHistory,
    setLoading,
    validateUrls,
    updateTaskStatus,
  };
};
