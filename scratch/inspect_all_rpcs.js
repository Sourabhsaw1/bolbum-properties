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
  if (schema && schema.paths) {
    const paths = Object.keys(schema.paths);
    const rpcs = paths.filter(p => p.startsWith('/rpc/')).map(p => p.replace('/rpc/', ''));
    console.log('ALL RPCs:');
    console.log(JSON.stringify(rpcs, null, 2));
  } else {
    console.log('Could not fetch OpenAPI schema.');
  }
}

run().catch(console.error);
