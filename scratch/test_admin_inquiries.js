const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('Testing admin inquiries fetch query...');
  
  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      id,
      message,
      created_at,
      is_read,
      properties (
        id,
        title
      ),
      buyer:profiles!inquiries_from_user_id_fkey (
        id,
        full_name,
        phone
      ),
      seller:profiles!inquiries_to_user_id_fkey (
        id,
        full_name,
        phone
      )
    `)
    .limit(5);

  if (error) {
    console.error('Error fetching admin inquiries:', error);
  } else {
    console.log('Admin inquiries fetch successful:', JSON.stringify(data, null, 2));
  }
}

run().catch(console.error);
