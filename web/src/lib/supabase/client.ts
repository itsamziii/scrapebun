"use client";

import type { SignedInSessionResource } from "@clerk/types";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/database.types";
import { env } from "~/env";

export function createClerkSupabaseClient(
  session: SignedInSessionResource | null | undefined,
) {
  if (!session) return null;

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    },
  );
}
