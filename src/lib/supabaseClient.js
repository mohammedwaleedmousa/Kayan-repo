const DEFAULT_SUPABASE_URL = 'https://lqepkzpqpgwkznvbhxlt.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_W0mvzXUxGcxsuKpTk-lOQw_gxTviG25';
const SUPABASE_SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

let clientPromise;

export function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = import(/* @vite-ignore */ SUPABASE_SDK_URL).then(({ createClient }) =>
      createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'kayan-supabase-auth',
        },
      }),
    );
  }

  return clientPromise;
}
