import { createClient } from '@supabase/supabase-js';

// Metemos los strings directos, sin usar import.meta.env
const supabaseUrl = "https://zahlthwktowwbozbhvxd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGx0aHdrdG93d2JvemJodnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjU1MDcsImV4cCI6MjA4ODQwMTUwN30.o1IYkyuOJ-N0KshEvlBby6t6pg0g2HqF9ewvMXJjkrM";

// El chequeo por las dudas, aunque acá ya sabemos que están
if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Error crítico: Faltan las credenciales.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);