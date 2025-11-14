-- Add Profile Picture Support to Eduhome.my Database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Update users table to add profile picture
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update students table to add profile picture
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update tutor_profiles table to add profile picture
ALTER TABLE public.tutor_profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create function to handle profile picture uploads
CREATE OR REPLACE FUNCTION public.upload_avatar(user_id UUID, file_path TEXT)
RETURNS TEXT AS $$
DECLARE
    public_url TEXT;
BEGIN
    -- Construct the public URL for the uploaded avatar
    public_url := 'https://upaocsnwqbncntpvlqdy.supabase.co/storage/v1/object/public/avatars/' || file_path;

    RETURN public_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;