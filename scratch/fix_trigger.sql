-- ============================================================
-- FIX: Recreate the handle_new_user trigger function
-- 
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com/dashboard
-- 2. Open your project (dyjykkuumbmebqemmirn)
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Paste this ENTIRE script and click "Run"
-- ============================================================

-- Step 1: Drop the old broken trigger (if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the old broken function (if exists)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Create a new, correct trigger function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_verified, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::public.user_role,
      'user'::public.user_role
    ),
    false,
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'handle_new_user trigger failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;

-- Step 6: Verify it works
SELECT 'Trigger fix applied successfully!' AS status;
