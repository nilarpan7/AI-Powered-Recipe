import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Saving recipes will be disabled.');
} else {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
}

export const supabaseAdmin = supabaseClient;


