import { createClient } from '@supabase/supabase-js';

// En lugar de escribir el texto largo, le decimos que lo busque en Vercel
const supabaseUrl = "https://zahlthwktowwbozbhvxd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGx0aHdrdG93d2JvemJodnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjU1MDcsImV4cCI6MjA4ODQwMTUwN30.o1IYkyuOJ-N0KshEvlBby6t6pg0g2HqF9ewvMXJjkrM";

// Un chequeo rápido por si las moscas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("⚠️ Atención: No se encontraron las variables de Supabase. Chequeá Vercel.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);