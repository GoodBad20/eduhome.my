-- Scheduling System Schema for Eduhome.my
-- Run this in your Supabase SQL Editor

-- Step 1: Create schedule_slots table for tutor availability
CREATE TABLE IF NOT EXISTS public.schedule_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Step 2: Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'online' CHECK (type IN ('online', 'in_person')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  notes TEXT,
  materials TEXT[] DEFAULT '{}',
  rate DECIMAL(10,2),
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create recurring_lessons table
CREATE TABLE IF NOT EXISTS public.recurring_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'online' CHECK (type IN ('online', 'in_person')),
  rate DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS on all tables
ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_lessons ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for schedule_slots
-- Tutors can view and manage their own schedule slots
CREATE POLICY "Tutors can manage own schedule slots" ON public.schedule_slots
  FOR ALL USING (tutor_id = auth.uid());

-- Service role can manage all schedule slots
CREATE POLICY "Service role can manage schedule slots" ON public.schedule_slots
  FOR ALL USING (auth.role() = 'service_role');

-- Step 6: Create RLS policies for lessons
-- Tutors can view and manage their own lessons
CREATE POLICY "Tutors can manage own lessons" ON public.lessons
  FOR ALL USING (tutor_id = auth.uid());

-- Parents can view lessons for their children
CREATE POLICY "Parents can view children lessons" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = lessons.student_id AND s.parent_id = auth.uid()
    )
  );

-- Service role can manage all lessons
CREATE POLICY "Service role can manage lessons" ON public.lessons
  FOR ALL USING (auth.role() = 'service_role');

-- Step 7: Create RLS policies for recurring_lessons
-- Tutors can view and manage their own recurring lessons
CREATE POLICY "Tutors can manage own recurring lessons" ON public.recurring_lessons
  FOR ALL USING (tutor_id = auth.uid());

-- Parents can view recurring lessons for their children
CREATE POLICY "Parents can view children recurring lessons" ON public.recurring_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = recurring_lessons.student_id AND s.parent_id = auth.uid()
    )
  );

-- Service role can manage all recurring lessons
CREATE POLICY "Service role can manage recurring lessons" ON public.recurring_lessons
  FOR ALL USING (auth.role() = 'service_role');

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_slots_tutor_id ON public.schedule_slots(tutor_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_day_time ON public.schedule_slots(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_available ON public.schedule_slots(is_available);

CREATE INDEX IF NOT EXISTS idx_lessons_tutor_id ON public.lessons(tutor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON public.lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_scheduled_time ON public.lessons(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON public.lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_date ON public.lessons(DATE(scheduled_time));

CREATE INDEX IF NOT EXISTS idx_recurring_lessons_tutor_id ON public.recurring_lessons(tutor_id);
CREATE INDEX IF NOT EXISTS idx_recurring_lessons_student_id ON public.recurring_lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_recurring_lessons_day_time ON public.recurring_lessons(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_recurring_lessons_active ON public.recurring_lessons(is_active);

-- Step 9: Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_scheduling_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Step 10: Create triggers for timestamp updates
DROP TRIGGER IF EXISTS update_schedule_slots_timestamp ON public.schedule_slots;
CREATE TRIGGER update_schedule_slots_timestamp
  BEFORE UPDATE ON public.schedule_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_scheduling_timestamp();

DROP TRIGGER IF EXISTS update_lessons_timestamp ON public.lessons;
CREATE TRIGGER update_lessons_timestamp
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_scheduling_timestamp();

DROP TRIGGER IF EXISTS update_recurring_lessons_timestamp ON public.recurring_lessons;
CREATE TRIGGER update_recurring_lessons_timestamp
  BEFORE UPDATE ON public.recurring_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_scheduling_timestamp();

-- Step 11: Create function to check time slot availability
CREATE OR REPLACE FUNCTION public.is_time_slot_available(
  tutor_id_param UUID,
  date_param DATE,
  start_time_param TIME,
  end_time_param TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_available BOOLEAN := TRUE;
  conflicting_lesson_count INTEGER;
BEGIN
  -- Check if tutor has availability slot for this day and time
  IF NOT EXISTS (
    SELECT 1 FROM public.schedule_slots
    WHERE tutor_id = tutor_id_param
    AND day_of_week = EXTRACT(DOW FROM date_param)
    AND start_time <= start_time_param
    AND end_time >= end_time_param
    AND is_available = TRUE
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check for conflicting lessons
  SELECT COUNT(*) INTO conflicting_lesson_count
  FROM public.lessons
  WHERE tutor_id = tutor_id_param
  AND DATE(scheduled_time) = date_param
  AND status NOT IN ('cancelled', 'no_show')
  AND (
    (scheduled_time <= make_timestamp(date_param, start_time_param) AND
     scheduled_time + (duration_minutes || ' minutes')::INTERVAL > make_timestamp(date_param, start_time_param)) OR
    (scheduled_time < make_timestamp(date_param, end_time_param) AND
     scheduled_time + (duration_minutes || ' minutes')::INTERVAL >= make_timestamp(date_param, end_time_param)) OR
    (scheduled_time >= make_timestamp(date_param, start_time_param) AND
     scheduled_time + (duration_minutes || ' minutes')::INTERVAL <= make_timestamp(date_param, end_time_param))
  );

  RETURN conflicting_lesson_count = 0;
END;
$$;

-- Step 12: Create function to get weekly schedule summary
CREATE OR REPLACE FUNCTION public.get_weekly_schedule_summary(
  tutor_id_param UUID,
  week_start_date DATE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  week_end_date DATE := week_start_date + 6;
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_lessons', COUNT(*),
    'completed_lessons', COUNT(*) FILTER (WHERE status = 'completed'),
    'upcoming_lessons', COUNT(*) FILTER (WHERE status IN ('scheduled', 'confirmed')),
    'total_hours', COALESCE(SUM(duration_minutes) / 60.0, 0),
    'earnings', COALESCE(SUM(rate), 0),
    'daily_breakdown', (
      SELECT json_agg(
        json_build_object(
          'date', lesson_date,
          'lessons', daily_count,
          'hours', COALESCE(daily_hours, 0)
        )
      )
      FROM (
        SELECT
          DATE(scheduled_time) as lesson_date,
          COUNT(*) as daily_count,
          COALESCE(SUM(duration_minutes) / 60.0, 0) as daily_hours
        FROM public.lessons
        WHERE tutor_id = tutor_id_param
        AND DATE(scheduled_time) BETWEEN week_start_date AND week_end_date
        GROUP BY DATE(scheduled_time)
        ORDER BY lesson_date
      ) daily_stats
    )
  ) INTO result
  FROM public.lessons
  WHERE tutor_id = tutor_id_param
  AND DATE(scheduled_time) BETWEEN week_start_date AND week_end_date;

  RETURN result;
END;
$$;

-- Step 13: Create function to generate lessons from recurring schedule
CREATE OR REPLACE FUNCTION public.generate_recurring_lessons()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    current_date DATE;
    end_date DATE;
    lesson_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate lessons for the next 4 weeks
    current_date := NEW.start_date;
    end_date := current_date + 28; -- 4 weeks

    WHILE current_date <= COALESCE(NEW.end_date, end_date) LOOP
        -- Check if the current date matches the recurring day
        IF EXTRACT(DOW FROM current_date) = NEW.day_of_week THEN
            -- Create lesson timestamp
            lesson_time := make_timestamp(current_date, NEW.start_time);

            -- Check if lesson already exists for this date
            IF NOT EXISTS (
                SELECT 1 FROM public.lessons
                WHERE tutor_id = NEW.tutor_id
                AND student_id = NEW.student_id
                AND DATE(scheduled_time) = current_date
            ) THEN
                -- Insert new lesson
                INSERT INTO public.lessons (
                    tutor_id,
                    student_id,
                    subject,
                    title,
                    scheduled_time,
                    duration_minutes,
                    location,
                    type,
                    rate,
                    status,
                    created_at,
                    updated_at
                ) VALUES (
                    NEW.tutor_id,
                    NEW.student_id,
                    NEW.subject,
                    NEW.title,
                    lesson_time,
                    NEW.duration_minutes,
                    NEW.location,
                    NEW.type,
                    NEW.rate,
                    'scheduled',
                    NOW(),
                    NOW()
                );
            END IF;
        END IF;

        current_date := current_date + 1;
    END LOOP;

    RETURN NEW;
END;
$$;

-- Step 14: Create trigger for recurring lesson generation
DROP TRIGGER IF EXISTS generate_recurring_lessons_trigger ON public.recurring_lessons;
CREATE TRIGGER generate_recurring_lessons_trigger
  AFTER INSERT OR UPDATE ON public.recurring_lessons
  FOR EACH ROW EXECUTE FUNCTION public.generate_recurring_lessons();

-- Step 15: Add unique constraints to prevent duplicate slots
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_schedule_slot
ON public.schedule_slots(tutor_id, day_of_week, start_time, end_time);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_recurring_lesson
ON public.recurring_lessons(tutor_id, student_id, day_of_week, start_time);

-- Success message
SELECT 'Scheduling system schema created successfully!' as status;