import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const createSupabaseClient = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  );

  return supabase;
};

export const useSupabase = () => {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const initSupabase = async () => {
      const client = await createSupabaseClient();

      if (session) {
        const token = await session.getToken({ template: "supabase" });
        if (token) {
          client.auth.setSession({
            access_token: token,
            refresh_token: "",
          });
        }
      }

      setSupabase(client);
    };

    initSupabase();
  }, [session]);

  return supabase;
};
