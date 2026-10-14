import { createClient } from '@supabase/supabase-js';

// Chaves PÚBLICAS (ver .env). A "publishable key" pode ficar no navegador: quem protege
// os dados são as regras RLS do banco (supabase/schema.sql).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!url || !key) {
  throw new Error('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no arquivo .env');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
