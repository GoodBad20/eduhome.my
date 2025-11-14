-- Fix infinite recursion in students table RLS policies
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing problematic policies on students table
DROP POLICY IF EXISTS "Parents can view own children" ON public.students;
DROP POLICY IF EXISTS "Parents can insert own children" ON public.students;
DROP POLICY IF EXISTS "Parents can update own children" ON public.students;
DROP POLICY IF EXISTS "Parents can delete own children" ON public.students;
DROP POLICY IF EXISTS "Service role full access to students" ON public.students;

-- Step 2: Create simple, non-recursive RLS policies for students
-- Parents can view their own children
CREATE POLICY "Parents can view own children" ON public.students
  FOR SELECT USING (parent_id = auth.uid());

-- Parents can insert their own children (this will be used by the parentService)
CREATE POLICY "Parents can insert own children" ON public.students
  FOR INSERT WITH CHECK (parent_id = auth.uid());

-- Parents can update their own children
CREATE POLICY "Parents can update own children" ON public.students
  FOR UPDATE USING (parent_id = auth.uid());

-- Parents can delete their own children
CREATE POLICY "Parents can delete own children" ON public.students
  FOR DELETE USING (parent_id = auth.uid());

-- Service role can manage all students
CREATE POLICY "Service role full access to students" ON public.students
  FOR ALL USING (auth.role() = 'service_role');

-- Step 3: Verify the policies were created correctly
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'students'
AND schemaname = 'public'
ORDER BY policyname;

-- Success message
SELECT 'Students table RLS policies fixed successfully!' as status;