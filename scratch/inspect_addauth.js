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
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`);
  const schema = await res.json();
  if (schema && schema.paths && schema.paths['/rpc/addauth']) {
    console.log('addauth RPC definition:');
    console.log(JSON.stringify(schema.paths['/rpc/addauth'], null, 2));
  } else {
    console.log('addauth RPC not found or has no definition.');
  }
}

run().catch(console.error);
