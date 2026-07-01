# Bol Bum Property & Construction
### Real Estate Platform — Next.js 14 + Supabase

---

## ⚡ Zero to Running — Step by Step

### Step 1: Install Node.js
Download from https://nodejs.org — install version 18 or higher.

Verify:
```
node --version   # should say v18 or higher
npm --version
```

---

### Step 2: Get the project running

```bash
# 1. Go into the project folder
cd bolbum-property

# 2. Install all packages
npm install

# 3. Copy the environment file
cp .env.example .env.local
```

---

### Step 3: Set up Supabase

1. Go to https://supabase.com — sign in / create account
2. Click **"New Project"** — give it a name, set a password, pick a region
3. Wait ~2 minutes for the project to spin up
4. Go to: **Project Settings → API**
5. Copy these 3 values into your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> ⚠️ Never share or commit your SERVICE_ROLE_KEY. It has full database access.

---

### Step 4: Run the SQL schema

1. In Supabase Dashboard → click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL the text and paste it into the SQL Editor
5. Click **"Run"** (green button)

You should see: *"Success. No rows returned"*

---

### Step 5: Create Storage Buckets

In Supabase Dashboard → **Storage** → **New Bucket**:

| Bucket Name     | Public? |
|-----------------|---------|
| property-media  | ✅ Yes  |
| avatars         | ✅ Yes  |

---

### Step 6: Enable Phone Auth (optional, for OTP login)

In Supabase Dashboard → **Authentication → Providers → Phone**:
- Enable it
- Add Twilio credentials (or use MSG91)

If you skip this, email magic link still works perfectly.

---

### Step 7: Run the app

```bash
npm run dev
```

Open http://localhost:3000 — your app is live! 🎉

---

### Step 8: Create your Admin account

1. Go to http://localhost:3000/auth/signup
2. Sign up with your email — choose any role
3. Click the magic link in your email
4. Now go to **Supabase → SQL Editor → New Query** and run:

```sql
update profiles
set role = 'admin', is_approved = true
where id = '<paste your user UUID here>';
```

To find your UUID: Supabase → **Authentication → Users** → copy your user ID.

5. Go to http://localhost:3000/dashboard/admin — you're in! 👑

---

## 📁 Project Structure

```
bolbum-property/
├── next.config.js
├── package.json
├── tsconfig.json
├── supabase/
│   └── schema.sql            ← run this ONCE in Supabase SQL Editor
└── src/
    ├── middleware.ts          ← route protection (runs on every request)
    ├── types/database.ts      ← TypeScript types for all DB tables
    ├── styles/globals.css     ← all CSS
    ├── lib/supabase/
    │   ├── browser.ts         ← use inside 'use client' components
    │   ├── server.ts          ← use in Server Components + API routes
    │   ├── middleware-client.ts ← only used in middleware.ts
    │   └── admin.ts           ← service role — bypasses RLS (server only)
    ├── app/
    │   ├── page.tsx           ← Homepage with featured properties
    │   ├── properties/
    │   │   ├── page.tsx       ← Browse + search + filters
    │   │   ├── new/page.tsx   ← Post a property (seller only)
    │   │   └── [id]/page.tsx  ← Property detail + inquiry
    │   ├── services/page.tsx  ← Construction, Borewell, 3D Design
    │   ├── auth/
    │   │   ├── login/         ← Email magic link + Phone OTP
    │   │   ├── signup/        ← Register with role picker
    │   │   ├── upgrade/       ← user → buyer/seller
    │   │   └── callback/      ← Supabase auth callback
    │   ├── dashboard/
    │   │   ├── admin/         ← Stats + approval queue + user list
    │   │   ├── seller/        ← Subscription + listings management
    │   │   ├── buyer/         ← Wishlist + services + inquiries
    │   │   └── user/          ← Profile + upgrade CTA
    │   ├── unauthorized/      ← 403 page
    │   └── api/
    │       ├── properties/approve/ ← Approve/reject listings (admin)
    │       └── auth/upgrade/       ← Role upgrade (user → buyer/seller)
    └── components/
        ├── layout/            ← Header, Footer
        ├── auth/              ← LoginForm, SignupForm, LogoutButton
        ├── properties/        ← WishlistButton, InquiryForm, PostPropertyForm, ServiceRequestForm
        └── admin/             ← ApproveRejectButtons
```

---

## 🔐 Role System

| Role     | How to get it                           | What they can do                               |
|----------|-----------------------------------------|------------------------------------------------|
| `user`   | Default on signup                       | Browse properties only                         |
| `buyer`  | Choose at signup or upgrade later       | Save wishlist, send inquiries, book services   |
| `seller` | Choose at signup or upgrade later       | Post properties (needs paid plan)              |
| `admin`  | Manual SQL update only                  | Approve/reject listings, see all users         |

**Upgrade from user → buyer/seller:**
- User visits `/auth/upgrade?role=buyer` or `/auth/upgrade?role=seller`
- Clicks confirm → role is updated instantly

**Create admin (SQL only):**
```sql
update profiles
set role = 'admin', is_approved = true
where id = '<uuid>';
```

---

## 🛣️ Route Protection

`src/middleware.ts` protects every route automatically:

- `/dashboard/*` → must be logged in
- `/properties/new` → must be logged in
- `/dashboard/admin` → must be `admin` + `is_approved = true`
- `/dashboard/seller` → must be `seller` or `admin`
- `/dashboard/buyer` → must be `buyer` or `admin`
- `/auth/login` + `/auth/signup` → redirects logged-in users to home

---

## 🔑 Login Methods

**Email Magic Link** (works out of the box):
- User enters email → Supabase sends a magic link → user clicks it → logged in

**Phone OTP** (requires Twilio/MSG91 setup):
- User enters +91 number → gets 6-digit SMS → enters it → logged in

---

## 📦 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 14 (App Router) |
| Database   | Supabase (PostgreSQL)   |
| Auth       | Supabase Auth           |
| Storage    | Supabase Storage        |
| Language   | TypeScript              |
| Styling    | Plain CSS (no Tailwind) |
| Fonts      | Playfair Display + DM Sans + JetBrains Mono |

---

## 🚀 Deploy to Production (Vercel)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/yourname/bolbum-property.git
git push -u origin main

# 2. Go to vercel.com → New Project → import from GitHub
# 3. Add environment variables (same 4 from .env.local)
# 4. Deploy!
```

In Supabase Dashboard → **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

---

## ❓ Common Issues

**"relation does not exist" error:**
→ You haven't run `supabase/schema.sql` yet. Go to Supabase → SQL Editor and run it.

**Magic link not arriving:**
→ Check spam folder. In Supabase → Authentication → Email Templates — make sure email is enabled.

**Phone OTP not working:**
→ You need to add Twilio credentials in Supabase → Authentication → Providers → Phone.

**"Missing SUPABASE_SERVICE_ROLE_KEY":**
→ You forgot to copy `.env.example` to `.env.local` or didn't fill in the service role key.

**Can't access /dashboard/admin:**
→ Make sure you ran the SQL to set `role = 'admin'` AND `is_approved = true` for your user.
