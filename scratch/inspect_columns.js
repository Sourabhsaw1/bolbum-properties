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
  console.log('Querying table information from Supabase...');
  
  // Query table columns using rpc or standard query if possible, or just insert a test row to see error/columns
  // Let's do a postgrest query to information_schema if allowed, or check by sending an empty insert
  const { data, error } = await supabase.from('inquiries').insert({}).select();
  console.log('Insert test response:');
  if (error) {
    console.log('Error (this reveals columns):', error);
  } else {
    console.log('Data:', data);
  }
}

run().catch(console.error);
