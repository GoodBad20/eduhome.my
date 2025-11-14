# Image Upload Issues - Debugging Guide

## 🔍 **Common Issues & Solutions**

### **Issue 1: Database Schema Not Updated**

**Symptoms:**
- Images appear to upload but don't save
- 404 errors for avatar URLs
- Profile pictures not persisting

**Solution:**
Run this SQL in Supabase Dashboard:
```sql
-- First, create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Update database schema
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.tutor_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1]));
```

### **Issue 2: Supabase Storage Not Configured**

**Symptoms:**
- Upload errors related to storage
- "Bucket not found" errors
- Permission denied errors

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create a new bucket called `avatars`
3. Set it as public
4. Enable RLS with the policies above

### **Issue 3: User ID Not Available During Upload**

**Problem:** The upload component tries to upload before user authentication is complete.

**Let me fix the ProfilePictureUpload component:**