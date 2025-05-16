import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import type { TaskHistory } from "../../../lib/types";

interface ScrapeHistoryCardProps {
  scrapeHistory: TaskHistory[];
}

export const ScrapeHistoryCard = ({
  scrapeHistory,
}: ScrapeHistoryCardProps) => {
  if (scrapeHistory.length === 0) {
    return (
      <p className="text-white/70">You haven't generated any results yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scrapeHistory.map((task) => (
        <Card
          key={task.id}
          className={`border-white/10 ${
            task.status === "running"
              ? "border-blue-500"
              : task.status === "success"
                ? "border-green-500"
                : "border-red-500"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-white">
              {task.type === "single" ? "Single Page" : "Multiple Pages"} Scrape
            </CardTitle>
            <CardDescription className="text-white/70">
              {new Date(task.created).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p
                className={`text-sm ${
                  task.status === "running"
                    ? "text-blue-400"
                    : task.status === "success"
                      ? "text-green-400"
                      : "text-red-400"
                }`}
              >
                Status: {task.status}
              </p>
              {task.data && (
                <p className="text-sm text-white/70">Data: {task.data}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
