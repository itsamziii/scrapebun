// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );
// lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export const useSupabaseWithClerk = () => {
  const { getToken } = useAuth();

  return useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (input: RequestInfo | URL, init: RequestInit = {}) => {
            const token = await getToken({ template: "supabase" });
            init.headers = {
              ...init.headers,
              Authorization: `Bearer ${token}`,
            };
            return fetch(input, init);
          },
        },
      },
    );
  }, [getToken]);
};
