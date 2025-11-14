-- Row Level Security (RLS) Policies for Eduhome Platform
-- Created: 2024-11-12

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (triggered by signup)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Students table policies
-- Students can view their own record
CREATE POLICY "Students can view own record" ON public.students
    FOR SELECT USING (user_id = auth.uid());

-- Parents can view their children's records
CREATE POLICY "Parents can view children records" ON public.students
    FOR SELECT USING (
        parent_id IN (
            SELECT id FROM public.users
            WHERE id = parent_id AND role = 'parent' AND auth.uid() = parent_id
        )
    );

-- Tutors can view students they teach
CREATE POLICY "Tutors can view their students" ON public.students
    FOR SELECT USING (
        id IN (
            SELECT student_id FROM public.sessions
            WHERE tutor_id = (SELECT id FROM public.tutors WHERE user_id = auth.uid())
        )
    );

-- Tutors table policies
-- Tutors can view their own record
CREATE POLICY "Tutors can view own record" ON public.tutors
    FOR SELECT USING (user_id = auth.uid());

-- Tutors can update their own record
CREATE POLICY "Tutors can update own record" ON public.tutors
    FOR UPDATE USING (user_id = auth.uid());

-- Everyone can view verified tutors
CREATE POLICY "Everyone can view verified tutors" ON public.tutors
    FOR SELECT USING (verification_status = 'verified');

-- Parents table policies
-- Parents can view their own record
CREATE POLICY "Parents can view own record" ON public.parents
    FOR SELECT USING (user_id = auth.uid());

-- Parents can update their own record
CREATE POLICY "Parents can update own record" ON public.parents
    FOR UPDATE USING (user_id = auth.uid());

-- Subjects table policies (public read access)
-- Everyone can view subjects
CREATE POLICY "Everyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

-- Only authenticated users can insert subjects
CREATE POLICY "Authenticated users can insert subjects" ON public.subjects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Lessons table policies
-- Tutors can view their own lessons
CREATE POLICY "Tutors can view own lessons" ON public.lessons
    FOR SELECT USING (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Students can view lessons assigned to them
CREATE POLICY "Students can view assigned lessons" ON public.lessons
    FOR SELECT USING (
        id IN (
            SELECT lesson_id FROM public.assignments
            WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
        )
    );

-- Parents can view lessons assigned to their children
CREATE POLICY "Parents can view children lessons" ON public.lessons
    FOR SELECT USING (
        id IN (
            SELECT lesson_id FROM public.assignments
            WHERE student_id IN (
                SELECT id FROM public.students
                WHERE parent_id = auth.uid()
            )
        )
    );

-- Tutors can create lessons
CREATE POLICY "Tutors can create lessons" ON public.lessons
    FOR INSERT WITH CHECK (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Tutors can update their own lessons
CREATE POLICY "Tutors can update own lessons" ON public.lessons
    FOR UPDATE USING (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Assignments table policies
-- Students can view their own assignments
CREATE POLICY "Students can view own assignments" ON public.assignments
    FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Parents can view their children's assignments
CREATE POLICY "Parents can view children assignments" ON public.assignments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students
            WHERE parent_id = auth.uid()
        )
    );

-- Tutors can view assignments for their lessons
CREATE POLICY "Tutors can view lesson assignments" ON public.assignments
    FOR SELECT USING (
        lesson_id IN (
            SELECT id FROM public.lessons
            WHERE tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid())
        )
    );

-- Students can update their own assignments (submission)
CREATE POLICY "Students can update own assignments" ON public.assignments
    FOR UPDATE USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Tutors can update assignment grades and feedback
CREATE POLICY "Tutors can grade assignments" ON public.assignments
    FOR UPDATE USING (
        lesson_id IN (
            SELECT id FROM public.lessons
            WHERE tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid())
        )
    );

-- Sessions table policies
-- Students can view their own sessions
CREATE POLICY "Students can view own sessions" ON public.sessions
    FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Parents can view their children's sessions
CREATE POLICY "Parents can view children sessions" ON public.sessions
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students
            WHERE parent_id = auth.uid()
        )
    );

-- Tutors can view their own sessions
CREATE POLICY "Tutors can view own sessions" ON public.sessions
    FOR SELECT USING (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Tutors can create sessions
CREATE POLICY "Tutors can create sessions" ON public.sessions
    FOR INSERT WITH CHECK (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Tutors can update their own sessions
CREATE POLICY "Tutors can update own sessions" ON public.sessions
    FOR UPDATE USING (tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid()));

-- Progress table policies
-- Students can view their own progress
CREATE POLICY "Students can view own progress" ON public.progress
    FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Parents can view their children's progress
CREATE POLICY "Parents can view children progress" ON public.progress
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students
            WHERE parent_id = auth.uid()
        )
    );

-- Tutors can view progress of students they teach
CREATE POLICY "Tutors can view student progress" ON public.progress
    FOR SELECT USING (
        student_id IN (
            SELECT student_id FROM public.sessions
            WHERE tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid())
        )
    );

-- Tutors can update student progress
CREATE POLICY "Tutors can update student progress" ON public.progress
    FOR UPDATE USING (
        updated_by_tutor_id IN (SELECT id FROM public.tutors WHERE user_id = auth.uid())
    );

-- Payments table policies
-- Parents can view their own payments
CREATE POLICY "Parents can view own payments" ON public.payments
    FOR SELECT USING (parent_id = auth.uid());

-- Tutors can view payments for their services
CREATE POLICY "Tutors can view received payments" ON public.payments
    FOR SELECT USING (tutor_id = auth.uid());

-- Students can view payments related to their education
CREATE POLICY "Students can view related payments" ON public.payments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Messages table policies
-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Users can send messages
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Users can mark messages as read (if they're the receiver)
CREATE POLICY "Users can update received messages" ON public.messages
    FOR UPDATE USING (receiver_id = auth.uid());

-- Create function to handle user profile creation after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
    );

    -- Create role-specific profile based on role
    IF NEW.raw_user_meta_data->>'role' = 'tutor' THEN
        INSERT INTO public.tutors (user_id, specialization, qualification, experience_years, hourly_rate)
        VALUES (
            NEW.id,
            ARRAY['Mathematics'], -- Default specialization
            COALESCE(NEW.raw_user_meta_data->>'qualification', 'Bachelor Degree'),
            COALESCE((NEW.raw_user_meta_data->>'experience_years')::INTEGER, 0),
            COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::DECIMAL, 50.00)
        );
    ELSIF NEW.raw_user_meta_data->>'role' = 'parent' THEN
        INSERT INTO public.parents (user_id, relationship_to_student)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'relationship', 'Parent')
        );
    ELSIF NEW.raw_user_meta_data->>'role' = 'student' THEN
        INSERT INTO public.students (user_id, grade_level, date_of_birth)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'grade_level', 'Grade 1'),
            COALESCE(NEW.raw_user_meta_data->>'date_of_birth'::DATE, '2010-01-01')
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();