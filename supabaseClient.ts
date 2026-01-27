import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlsdkvtdmmdmvmngcrnq.supabase.co';
const supabaseKey = 'sb_publishable_VDvf6jxFRXYBS5I7Gfiv-w_vbDz8xZH';

export const supabase = createClient(supabaseUrl, supabaseKey);
