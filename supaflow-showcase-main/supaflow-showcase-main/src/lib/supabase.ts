import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zahlthwktowwbozbhvxd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGx0aHdrdG93d2JvemJodnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjU1MDcsImV4cCI6MjA4ODQwMTUwN30.o1IYkyuOJ-N0KshEvlBby6t6pg0g2HqF9ewvMXJjkrM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
