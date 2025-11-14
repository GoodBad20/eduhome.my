-- Fix RLS Policy Recursion for Students Table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- First, drop all existing policies on the students table to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own student profiles" ON public.students;
DROP POLICY IF EXISTS "Parents can insert their children's student profiles" ON public.students;
DROP POLICY IF EXISTS "Parents can update their children's student profiles" ON public.students;
DROP POLICY IF EXISTS "Parents can delete their children's student profiles" ON public.students;

-- Create new, non-recursive policies for students table
CREATE POLICY "Enable read access for all authenticated users" ON public.students
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.students
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on parent_id" ON public.students
    FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "Enable delete for users based on parent_id" ON public.students
    FOR DELETE USING (auth.uid() = parent_id);

-- Alternative approach: Simpler policies that don't cause recursion
-- Uncomment and use these if the above still cause issues

/*
-- Simple policies that should work without recursion
CREATE POLICY "Students select policy" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Students insert policy" ON public.students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Students update policy" ON public.students
    FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "Students delete policy" ON public.students
    FOR DELETE USING (auth.uid() = parent_id);
*/