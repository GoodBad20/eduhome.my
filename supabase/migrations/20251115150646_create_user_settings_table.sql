-- Create user_settings table for storing user preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile Settings
  full_name TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'English',

  -- Notification Settings
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  lesson_reminders BOOLEAN DEFAULT true,
  payment_alerts BOOLEAN DEFAULT true,
  message_notifications BOOLEAN DEFAULT true,
  progress_reports BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  student_requests BOOLEAN DEFAULT true,

  -- Privacy Settings
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private')),
  show_contact_info BOOLEAN DEFAULT false,
  data_sharing BOOLEAN DEFAULT false,
  two_factor_auth BOOLEAN DEFAULT false,

  -- Appearance Settings
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  compact_mode BOOLEAN DEFAULT false,

  -- Tutor-specific Settings (nullable for non-tutors)
  subjects JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  qualifications TEXT,
  experience TEXT,
  hourly_rate DECIMAL(10,2),
  teaching_levels JSONB DEFAULT '[]'::jsonb,
  availability JSONB DEFAULT '{}'::jsonb,
  verification_status TEXT DEFAULT 'pending',
  average_rating DECIMAL(3,2) DEFAULT 0.00,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_profile_visibility ON user_settings(profile_visibility);

-- Enable RLS (Row Level Security)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_settings_updated_at();