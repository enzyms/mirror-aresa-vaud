import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puasomqhzewevhlijqwb.supabase.co';
const supabaseAnonKey = 'sb_publishable_hyrSTWAKt8LDMaZJy5OeTA_wD7u6LFL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKET_NAME = 'aresa_research_bucket';
