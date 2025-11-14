-- COMPLETE DATABASE SETUP for Eduhome Platform
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql
-- This fixes missing columns and adds avatar support

-- Step 1: Fix existing tables with missing columns
DO $$
BEGIN
    -- Fix students table with all required columns
    ALTER TABLE public.students
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS grade_level INTEGER,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    -- Fix tutors table with all required columns
    ALTER TABLE public.tutors
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS subjects TEXT[], -- Using array for subjects
    ADD COLUMN IF NOT EXISTS education TEXT,
    ADD COLUMN IF NOT EXISTS experience INTEGER,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    -- Fix users table with all required columns
    ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    -- Fix tutor_profiles table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tutor_profiles') THEN
        ALTER TABLE public.tutor_profiles
        ADD COLUMN IF NOT EXISTS full_name TEXT,
        ADD COLUMN IF NOT EXISTS avatar_url TEXT,
        ADD COLUMN IF NOT EXISTS bio TEXT,
        ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS subjects TEXT[], -- Using array for subjects
        ADD COLUMN IF NOT EXISTS education TEXT,
        ADD COLUMN IF NOT EXISTS experience INTEGER;
    END IF;

    -- Ensure roles table exists
    CREATE TABLE IF NOT EXISTS public.roles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Insert default roles if they don't exist
    INSERT INTO public.roles (name, description) VALUES
        ('parent', 'Parent user who manages children'),
        ('tutor', 'Tutor who provides teaching services'),
        ('student', 'Student who receives tutoring'),
        ('admin', 'Administrator user')
    ON CONFLICT (name) DO NOTHING;

END $$;

-- Step 2: Create the avatars storage bucket
DO $$
BEGIN
    BEGIN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', false)
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Cannot create storage bucket automatically. Please create it manually in Supabase Dashboard → Storage.';
    END;
END $$;

-- Step 3: Sync student and tutor names from users table
DO $$
BEGIN
    -- Create fallback names from email for students
    UPDATE public.students s
    SET full_name = 'Student ' || SPLIT_PART(u.email, '@', 1)
    FROM public.users u
    WHERE s.user_id = u.id
    AND (s.full_name IS NULL OR s.full_name = '');

    -- Create fallback names from email for tutors
    UPDATE public.tutors t
    SET full_name = 'Tutor ' || SPLIT_PART(u.email, '@', 1)
    FROM public.users u
    WHERE t.user_id = u.id
    AND (t.full_name IS NULL OR t.full_name = '');

    -- Update users table with fallback names
    UPDATE public.users u
    SET full_name = SPLIT_PART(u.email, '@', 1)
    WHERE (u.full_name IS NULL OR u.full_name = '');

    -- If students/tutors have their own name columns, copy them
    -- This handles case where they might have name columns we don't know about
    BEGIN
        UPDATE public.students s
        SET full_name = COALESCE(s.first_name || ' ' || s.last_name, s.name, s.full_name)
        WHERE s.user_id IN (SELECT id FROM public.users WHERE id = s.user_id);
    EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Students table may not have first_name/last_name columns';
    END;

    BEGIN
        UPDATE public.tutors t
        SET full_name = COALESCE(t.first_name || ' ' || t.last_name, t.name, t.full_name)
        WHERE t.user_id IN (SELECT id FROM public.users WHERE id = t.user_id);
    EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Tutors table may not have first_name/last_name columns';
    END;
END $$;

-- Step 4: Verification query
SELECT 'Database setup completed' as status,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'students' AND column_name = 'full_name') as students_full_name_column,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'students' AND column_name = 'avatar_url') as students_avatar_column,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'tutors' AND column_name = 'full_name') as tutors_full_name_column,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'tutors' AND column_name = 'avatar_url') as tutors_avatar_column,
       (SELECT COUNT(*) FROM storage.buckets WHERE id = 'avatars') as avatars_bucket;

-- Step 5: Show sample data
SELECT 'students' as table_name, COUNT(*) as row_count FROM public.students
UNION ALL
SELECT 'tutors' as table_name, COUNT(*) as row_count FROM public.tutors
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM public.users;

-- Step 6: Manual Storage Setup Instructions (if bucket creation failed)
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