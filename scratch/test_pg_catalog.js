const fs = require('fs');
const path = require('path');

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

async function run() {
  console.log('Attempting to fetch pg_trigger via REST API...');
  const res = await fetch(`${supabaseUrl}/rest/v1/pg_trigger?apikey=${supabaseServiceKey}`, {
    headers: {
      'Accept-Profile': 'pg_catalog'
    }
  });
  if (res.ok) {
    const data = await res.json();
    console.log('Success fetching pg_trigger! Samples:');
    console.log(data.slice(0, 5));
  } else {
    console.log('Failed fetching pg_trigger:', res.status, await res.text());
  }
}

run().catch(console.error);
