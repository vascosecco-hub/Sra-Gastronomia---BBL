import { createClient } from '@supabase/supabase-js';

// No ambiente de desenvolvimento local (Vite) ou em Produção (Vercel/Netlify),
// as chaves serão lidas das variáveis de ambiente 'import.meta.env'.
// Mantivemos as strings como fallback para garantir que o preview atual continue funcionando.

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://zlsdkvtdmmdmvmngcrnq.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VDvf6jxFRXYBS5I7Gfiv-w_vbDz8xZH';

export const supabase = createClient(supabaseUrl, supabaseKey);