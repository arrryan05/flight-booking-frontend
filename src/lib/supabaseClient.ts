import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Now supabase.from('profiles') will know the row type is Database['public']['profiles']
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
