"use client";
import { createBrowserClient } from "@supabase/ssr";
import { env } from "~/env";

export const supabase = async (token: string) =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
