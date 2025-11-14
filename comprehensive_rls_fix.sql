-- Comprehensive RLS Fix for All Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Disable RLS temporarily to fix issues
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simple, non-recursive policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Simple, safe policies for students table
DROP POLICY IF EXISTS EXISTS ON public.students;

CREATE POLICY "Allow all operations for authenticated users" ON public.students
    FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Even simpler approach if needed
-- ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Create simple policies for other tables too
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS EXISTS ON public.tutor_profiles;

CREATE POLICY "Allow read access for all users" ON public.tutor_profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow tutors to manage their own profiles" ON public.tutor_profiles
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS EXISTS ON public.lessons;

CREATE POLICY "Allow all operations for authenticated users" ON public.lessons
    FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS EXISTS ON public.assignments;

CREATE POLICY "Allow all operations for authenticated users" ON public.assignments
    FOR ALL USING (auth.role() = 'authenticated');