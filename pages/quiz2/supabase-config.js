// Supabase Configuration
const SUPABASE_URL = 'https://kpjnrcbifbdgpozcvpod.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KPVEbVw_8PrHiD9Qdaeosw_1n2d_Z7q';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Admin password (stored locally for simple auth)
const ADMIN_PASSWORD = 'admin123';
