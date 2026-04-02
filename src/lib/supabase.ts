import { createClient } from '@supabase/supabase-js';

// En lugar de escribir el texto largo, le decimos que lo busque en Vercel
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Un chequeo rápido por si las moscas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("⚠️ Atención: No se encontraron las variables de Supabase. Chequeá Vercel.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);