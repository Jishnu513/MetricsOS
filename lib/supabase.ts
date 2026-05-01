import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function isRealValue(value: string) {
  return value.length > 0 && !value.startsWith("your-");
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const hasSupabaseRuntimeConfig =
  isValidHttpUrl(supabaseUrl) && isRealValue(supabaseKey);

export const hasSupabaseServiceConfig =
  isValidHttpUrl(supabaseUrl) && isRealValue(serviceKey);

export const supabase = hasSupabaseRuntimeConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper for server-side routes that need admin privileges
export const getServiceSupabase = () => {
  if (!hasSupabaseServiceConfig) {
    throw new Error("Supabase service configuration is missing or invalid");
  }
  return createClient(supabaseUrl, serviceKey);
};
