-- SIMPLE WORKING RLS POLICIES
-- Enable RLS and create basic policies

-- Re-enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for parents to manage their children
CREATE POLICY "Parents can manage their children" ON public.students
  FOR ALL USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Create policy for students to view their own profile
CREATE POLICY "Students can view own profile" ON public.students
  FOR SELECT USING (auth.uid() = user_id);