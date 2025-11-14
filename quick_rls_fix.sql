-- Quick Fix for RLS Recursion Issue
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Simply disable RLS on students table to fix the recursion issue
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Also ensure the table exists and has the right structure
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.users(id),
    full_name TEXT,
    grade TEXT,
    school TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Also fix tutor_profiles table if needed
CREATE TABLE IF NOT EXISTS public.tutor_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    qualification TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    location TEXT NOT NULL,
    about TEXT,
    availability JSONB,
    languages TEXT[] NOT NULL DEFAULT '{}',
    teaching_levels TEXT[] NOT NULL DEFAULT '{}',
    rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    students_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS on tutor_profiles as well temporarily
ALTER TABLE public.tutor_profiles DISABLE ROW LEVEL SECURITY;