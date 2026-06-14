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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log('Connecting to your Supabase project: ' + supabaseUrl);
  
  // 1. Get the user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    process.exit(1);
  }

  const targetEmail = 'sourabhsaw2005@gmail.com';
  const user = users.find(u => u.email === targetEmail);

  if (!user) {
    console.error(`Error: User with email ${targetEmail} not found!`);
    console.error('Please make sure you have signed up in the app first.');
    process.exit(1);
  }

  console.log(`Found your user! ID: ${user.id}`);

  // 2. Set user as Admin and Approved in profiles
  console.log('Updating profiles table to set you as Admin...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: 'Sourabh Saw',
      role: 'admin',
      is_approved: true
    });

  if (profileError) {
    console.error('Error updating profiles table:', profileError);
    process.exit(1);
  }
  console.log('Success: Profiles table updated. You are now Admin!');

  // 3. Clear existing locations and properties to avoid duplicates
  console.log('Clearing any duplicate properties/locations to keep database clean...');
  await supabase.from('property_locations').delete().neq('address', 'dummy_safeguard');
  await supabase.from('properties').delete().neq('title', 'dummy_safeguard');

  // 4. Properties data to seed
  const properties = [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      seller_id: user.id,
      title: 'Modern 3BHK Villa in Varanasi',
      description: 'Beautiful modern luxury villa with spacious rooms, modular kitchen, and beautiful front garden. Located in a premium secure colony near BHU.',
      property_type: 'house',
      status: 'active',
      price: 6800000,
      price_negotiable: true,
      area_sqft: 1850,
      bedrooms: 3,
      bathrooms: 2,
      floors: 2,
      facing: 'North',
      is_featured: true,
      is_verified: true
    },
    {
      id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e',
      seller_id: user.id,
      title: 'Ready to Move 2BHK Flat — Sigra',
      description: 'Well-maintained high-rise apartment flat in Sigra. Close to malls and Kashi Vishwanath Temple. 24x7 power backup, lift, and society security.',
      property_type: 'flat',
      status: 'active',
      price: 3200000,
      price_negotiable: true,
      area_sqft: 1100,
      bedrooms: 2,
      bathrooms: 2,
      floors: 1,
      facing: 'East',
      is_featured: true,
      is_verified: false
    },
    {
      id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      seller_id: user.id,
      title: 'Prime Residential Plot in Ashapur',
      description: 'Prime land/plot in Ashapur enclave. 30ft wide direct road access, ready boundary wall. Clean title registry, immediate possession.',
      property_type: 'plot',
      status: 'active',
      price: 4500000,
      price_negotiable: true,
      area_sqft: 1500,
      bedrooms: null,
      bathrooms: null,
      floors: null,
      facing: 'West',
      is_featured: false,
      is_verified: true
    },
    {
      id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
      seller_id: user.id,
      title: 'Commercial Office Space in Gomti Nagar',
      description: 'Premium double-height commercial space suitable for IT office, bank, or showroom. Main road facing with ample basement parking space.',
      property_type: 'commercial',
      status: 'active',
      price: 12500000,
      price_negotiable: false,
      area_sqft: 2400,
      bedrooms: null,
      bathrooms: 2,
      floors: 1,
      facing: 'South',
      is_featured: true,
      is_verified: true
    },
    {
      id: 'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      seller_id: user.id,
      title: 'Agricultural Land near Prayagraj Highway',
      description: 'Highly fertile agricultural land with direct connection to NH-19. Fitted with water boring. Ideal for farming, farmhouse or industrial use.',
      property_type: 'land',
      status: 'active',
      price: 8500000,
      price_negotiable: true,
      area_sqft: 43560,
      bedrooms: null,
      bathrooms: null,
      floors: null,
      facing: 'North',
      is_featured: false,
      is_verified: false
    },
    {
      id: 'f67a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
      seller_id: user.id,
      title: 'Luxury 4BHK Penthouse with Private Terrace',
      description: 'Ultra luxury spacious penthouse in the heart of Lucknow (Hazratganj). Private garden, Jacuzzi, modern modular kitchen, and panoramic city views.',
      property_type: 'flat',
      status: 'active',
      price: 18500000,
      price_negotiable: false,
      area_sqft: 3200,
      bedrooms: 4,
      bathrooms: 4,
      floors: 1,
      facing: 'East',
      is_featured: true,
      is_verified: true
    }
  ];

  const locations = [
    {
      property_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      address: 'Plot 42, Sunderpur Colony',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005'
    },
    {
      property_id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e',
      address: 'Apartment 304, Sigra Heights',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221010'
    },
    {
      property_id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      address: 'Pocket C, Ashapur Enclave',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221007'
    },
    {
      property_id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
      address: 'Sector 4, Gomti Nagar Road',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226010'
    },
    {
      property_id: 'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      address: 'NH-19, near Phaphamau Crossing',
      city: 'Prayagraj',
      state: 'Uttar Pradesh',
      pincode: '211013'
    },
    {
      property_id: 'f67a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
      address: 'Tower B, Hazratganj Heights',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001'
    }
  ];

  console.log('Inserting new premium properties into properties table...');
  const { error: insertPropError } = await supabase.from('properties').insert(properties);
  if (insertPropError) {
    console.error('Error inserting properties:', insertPropError);
    process.exit(1);
  }
  console.log('Success: Properties inserted!');

  console.log('Inserting property locations...');
  const { error: insertLocError } = await supabase.from('property_locations').insert(locations);
  if (insertLocError) {
    console.error('Error inserting locations:', insertLocError);
    process.exit(1);
  }
  console.log('Success: Property locations inserted!');
  console.log('\nAll dynamic seed work completed! Your app is fully seeded! 🚀');
}

run().catch(console.error);
