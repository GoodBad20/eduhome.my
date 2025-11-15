-- Create schedule_activities table for managing student activities and schedules
CREATE TABLE IF NOT EXISTS schedule_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_type VARCHAR(50) NOT NULL DEFAULT 'custom',
  subject VARCHAR(100),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER DEFAULT 60, -- in minutes
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'pending')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  reminders JSONB,
  notes TEXT,
  color VARCHAR(7) DEFAULT '#106EBE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_schedule_activities_child_id ON schedule_activities(child_id);
CREATE INDEX idx_schedule_activities_date ON schedule_activities(date);
CREATE INDEX idx_schedule_activities_type ON schedule_activities(activity_type);
CREATE INDEX idx_schedule_activities_status ON schedule_activities(status);

-- Enable RLS (Row Level Security)
ALTER TABLE schedule_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Parents can view their children's activities" ON schedule_activities
  FOR SELECT USING (
    child_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's activities" ON schedule_activities
  FOR ALL USING (
    child_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_schedule_activities_updated_at
    BEFORE UPDATE ON schedule_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();