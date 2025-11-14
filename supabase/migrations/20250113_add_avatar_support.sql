-- Avatar Support Migration for Eduhome Platform
-- Created: 2025-01-13
-- This migration adds avatar support to the existing database

-- Add avatar_url columns to tables that don't have them yet
-- Check if column exists before adding to avoid errors
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

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES (
    'avatars',
    'avatars',
    false
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for avatars storage bucket
-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can view their own avatar
CREATE POLICY "Users can view own avatar" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Public can view all avatars (for profile pictures)
CREATE POLICY "Public can view avatars" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'avatars'
    );

-- Create a function to get the public avatar URL for a user
CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT public_url
        FROM storage.objects
        WHERE bucket_id = 'avatars'
        AND name = user_id::text || '/avatar'
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update avatar URL in user tables when avatar is uploaded
CREATE OR REPLACE FUNCTION public.handle_avatar_upload()
RETURNS TRIGGER AS $$
BEGIN
    -- Update users table avatar_url when avatar is uploaded
    IF NEW.bucket_id = 'avatars' AND TG_OP = 'INSERT' THEN
        UPDATE public.users
        SET avatar_url = public_url
        WHERE id = (storage.foldername(NEW.name))[1]::UUID;

        -- Also update role-specific tables if they exist
        UPDATE public.students
        SET avatar_url = public_url
        WHERE user_id = (storage.foldername(NEW.name))[1]::UUID;

        UPDATE public.tutors
        SET avatar_url = public_url
        WHERE user_id = (storage.foldername(NEW.name))[1]::UUID;

        -- Update tutor_profiles if it exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tutor_profiles') THEN
            UPDATE public.tutor_profiles
            SET avatar_url = public_url
            WHERE user_id = (storage.foldername(NEW.name))[1]::UUID;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle avatar URL updates
CREATE TRIGGER on_avatar_upload
    AFTER INSERT ON storage.objects
    FOR EACH ROW EXECUTE FUNCTION public.handle_avatar_upload();

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;