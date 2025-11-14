-- WORKING AVATAR SETUP - User-friendly version
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql
-- This version works with regular user permissions (no system table modifications)

-- Step 1: Add avatar_url columns to user tables
DO $$
BEGIN
    -- Add avatar_url to students table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='students' AND column_name='avatar_url'
    ) THEN
        ALTER TABLE public.students ADD COLUMN avatar_url TEXT;
    END IF;

    -- Add avatar_url to tutors table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='tutors' AND column_name='avatar_url'
    ) THEN
        ALTER TABLE public.tutors ADD COLUMN avatar_url TEXT;
    END IF;

    -- Add avatar_url to users table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='avatar_url'
    ) THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
    END IF;

    -- For tutor_profiles table (if it exists separately from tutors)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name='tutor_profiles'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='tutor_profiles' AND column_name='avatar_url'
        ) THEN
            ALTER TABLE public.tutor_profiles ADD COLUMN avatar_url TEXT;
        END IF;
    END IF;
END $$;

-- Step 2: Create the avatars storage bucket (if you have permissions)
-- If this fails, you'll need to create the bucket manually in the Supabase Dashboard
-- Go to Storage → Create new bucket → Name: "avatars" → Public: No

-- Try to create bucket programmatically (may fail due to permissions)
DO $$
BEGIN
    -- Only try if user has storage admin permissions
    BEGIN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', false)
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Cannot create storage bucket automatically. Please create it manually in Supabase Dashboard → Storage.';
    END;
END $$;

-- Step 3: Verification query
SELECT 'Avatar setup completed (partial - storage bucket may need manual creation)' as status,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'students' AND column_name = 'avatar_url') as students_column_added,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'tutors' AND column_name = 'avatar_url') as tutors_column_added,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'avatar_url') as users_column_added;

-- Step 4: Manual setup instructions (if automatic bucket creation failed)
/*
If the storage bucket creation failed above, follow these steps:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy
2. Click on "Storage" in the left sidebar
3. Click "Create new bucket"
4. Set:
   - Name: avatars
   - Public bucket: No (uncheck)
5. Click "Create bucket"
6. Go to the bucket settings (gear icon)
7. Add these policies in the "Policies" section:

Policy 1 - Allow authenticated users to upload:
INSERT policy where bucket_id = 'avatars' AND auth.role() = 'authenticated'

Policy 2 - Allow public viewing:
SELECT policy where bucket_id = 'avatars'

The ProfilePictureUpload component has built-in fallback to data URLs if storage fails,
so profile pictures will still work even without the storage bucket setup.
*/