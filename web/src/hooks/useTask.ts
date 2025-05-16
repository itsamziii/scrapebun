import { useState, useCallback, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { createTask } from "~/lib/queries/createTask";
import { updateTask } from "~/lib/queries/updateTask";
import { getAllTasks } from "~/lib/queries/getTasks";
import { urlSchema, taskSchema } from "../lib/validators";
import type { TaskHistory, TaskType, TaskStatus } from "../lib/types";

export const useTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
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

    fetchToken();
  }, [user, getToken]);

  const validateUrls = (urls: string[]) => {
    try {
      taskSchema.shape.urls.parse(urls);
      return true;
    } catch (error) {
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
    fetchTaskHistory();
  }, [fetchTaskHistory]);

  const handleTaskSelect = useCallback(
    async (type: TaskType) => {
      if (userId && token && type) {
        try {
          const newTask = await createTask(userId, token, type);

          if (newTask) {
            setCurrentTaskId(newTask.id);
            setScrapeStatus("running");

            const taskHistory: TaskHistory = {
              id: newTask.id,
              type: type,
              user_id: userId,
              created: new Date().toISOString(),
              status: "running",
              data: null,
            };

            setScrapeHistory((prev) => [taskHistory, ...prev]);
          }
        } catch (error) {
          console.error("Error handling task selection:", error);
          toast.error("Failed to initialize task");
        }
      }
    },
    [userId, token],
  );

  return {
    userId,
    token,
    currentTaskId,
    scrapeStatus,
    scrapeHistory,
    loading,
    setLoading,
    setScrapeStatus,
    validateUrls,
    updateTaskStatus,
    handleTaskSelect,
  };
};
