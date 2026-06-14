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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function trySignup(metadata) {
  const testEmail = `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  const testPassword = 'Password123!';
  
  console.log(`\n--- Trying signup with metadata: ${JSON.stringify(metadata)} ---`);
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: metadata
    }
  });

  if (error) {
    console.error('FAILED:', error.message);
    return false;
  } else {
    console.log('SUCCESS!');
    console.log('User ID:', data.user.id);
    return true;
  }
}

async function run() {
  await trySignup(undefined); // No options data
  await trySignup({}); // Empty options data
  await trySignup({ full_name: 'Test' }); // Only full_name
  await trySignup({ role: 'seller' }); // Only role
}

run().catch(console.error);
