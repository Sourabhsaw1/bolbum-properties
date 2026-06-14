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
  console.log('Inspecting Profiles table metadata...');
  
  // 1. Try to fetch one row from profiles
  const { data: profileRow, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) {
    console.error('Error fetching from profiles:', pError);
  } else {
    console.log('Sample profile row:', profileRow);
  }

  // 2. Query Postgres system tables using RPC or SQL query if we have an RPC endpoint,
  // since we don't have direct SQL interface in client, let's query via postgrest if we can:
  // Usually, we can query information_schema or run a dummy insert to get an error describing the row.
  console.log('\nRunning dummy insert into profiles to see constraints...');
  const { data: insData, error: insError } = await supabase.from('profiles').insert({}).select();
  console.log('Dummy insert error:', insError);

  // 3. Let's list trigger details by executing an RPC or inspect the functions if any exist.
  // Wait, let's query the supabase REST API for openapi.json, which lists all tables and their columns!
  console.log('\nFetching OpenAPI schema for table structures...');
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`);
  const schema = await res.json();
  if (schema && schema.definitions) {
    console.log('Definitions in public schema:', Object.keys(schema.definitions));
    if (schema.definitions.profiles) {
      console.log('Profiles table columns:', schema.definitions.profiles.properties);
    }
  } else {
    console.log('Could not fetch OpenAPI schema.');
  }
}

run().catch(console.error);
