const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Need service role key to bypass RLS or create tables easily, but let's just check with ANON first.

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1);
  console.log('Data:', data);
  console.log('Error:', error);
}

check();
