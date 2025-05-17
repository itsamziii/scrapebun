import { useState, useCallback, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { updateTask } from "~/lib/queries/updateTask";
import { getAllTasks } from "~/lib/queries/getTasks";
import { taskSchema } from "../lib/validators";
import type { TaskHistory, TaskStatus } from "../lib/types";

export const useTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [scrapeStatus, setScrapeStatus] = useState<TaskStatus>("idle");
  const [scrapeHistory, setScrapeHistory] = useState<TaskHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUserId(user.id);

    const fetchToken = async () => {
      const token = await getToken();
      if (!token) return;
      setToken(token);
    };

    void fetchToken();
  }, [user, getToken]);

  const validateUrls = (urls: string[]) => {
    try {
      taskSchema.shape.urls.parse(urls);
      return true;
    } catch (error) {
      console.error("Error validating URLs:", error);
      toast.error("Please enter valid URLs");
      return false;
    }
  };

  const fetchTaskHistory = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const tasks = await getAllTasks(userId, token);
      if (tasks) {
        setScrapeHistory(tasks);
      }
    } catch (error) {
      console.error("Error fetching task history:", error);
    }
  }, [userId, token]);

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus, data?: string) => {
      if (!userId || !token) return;

      try {
        await updateTask(userId, token, taskId, status, data);

        setScrapeHistory((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, status, ...(data && { data }) }
              : task,
          ),
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },
    [userId, token],
  );

  useEffect(() => {
    void fetchTaskHistory();
  }, [fetchTaskHistory]);

  return {
    userId,
    token,
    scrapeStatus,
    scrapeHistory,
    loading,
    setScrapeHistory,
    setLoading,
    setScrapeStatus,
    validateUrls,
    updateTaskStatus,
  };
};
