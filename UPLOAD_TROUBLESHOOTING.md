# Image Upload Troubleshooting Checklist

## 🔧 **Complete Fix Steps:**

### **Step 1: Run the Complete SQL Fix**
Copy and paste this ENTIRE SQL into your Supabase SQL Editor:
```sql
-- COMPLETE FIX for Profile Picture Upload Issues
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Step 1: Create the avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Enable RLS on storage if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatars" ON storage.objects;

-- Step 4: Create proper RLS policies for avatars bucket
-- Allow users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Allow users to view all avatars (publicly accessible)
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Step 5: Add avatar_url columns if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.tutor_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### **Step 2: Verify Storage Bucket Exists**
1. Go to Supabase Dashboard
2. Click on "Storage" in the left sidebar
3. You should see an "avatars" bucket
4. The bucket should be marked as "Public"

### **Step 3: Test the Upload**
1. Go to http://localhost:3000/auth/signup
2. Try to upload a profile picture
3. Check the browser console for any error messages
4. Open browser's Network tab to see upload requests

## 🔍 **Common Error Messages & Solutions:**

### **Error: "Bucket not found"**
**Solution:** Run the SQL above to create the bucket

### **Error: "Permission denied"**
**Solution:** Check that RLS policies are properly set up

### **Error: "User ID not available"**
**Solution:** The component now handles this with fallback to data URLs

### **Error: "File size too large"**
**Solution:** Images must be smaller than 5MB

### **Error: "Invalid file type"**
**Solution:** Only image files (JPG, PNG, GIF, etc.) are allowed

## 🛠️ **Debugging Steps:**

### **1. Check Browser Console**
Open Chrome DevTools (F12) → Console tab
- Look for any JavaScript errors
- Check for network requests failing

### **2. Check Network Tab**
Open Chrome DevTools → Network tab
- Filter by "storage" or "avatars"
- See if upload requests are being made
- Check response status codes

### **3. Check Supabase Storage**
Go to your Supabase project:
- Storage → avatars bucket
- See if files are appearing there

### **4. Check Database**
Run this SQL to see if avatar_url is being saved:
```sql
SELECT id, email, full_name, avatar_url
FROM public.users
WHERE avatar_url IS NOT NULL;
```

## 🚀 **How to Test Properly:**

### **Test 1: New User Signup**
1. Go to http://localhost:3000/auth/signup
2. Fill out the form
3. Upload a profile picture
4. Complete signup
5. Check if avatar appears in dashboard

### **Test 2: Add Child with Photo**
1. Login as existing parent
2. Go to dashboard
3. Click "Add Child"
4. Upload child's photo
5. Complete child creation
6. Check if child's photo appears in ChildCard

### **Test 3: Update Profile Picture**
1. Login as existing user
2. Go to profile section (if available)
3. Click "Edit"
4. Upload new photo
5. Check if it updates

## ⚡ **Quick Fixes:**

### **If upload completely fails:**
The component now falls back to using data URLs, so the profile picture will still work even if Supabase Storage fails.

### **If you see 404 errors for avatars:**
This is normal for placeholder avatar references. Real uploaded avatars will work once the database is properly configured.

### **If console shows upload errors:**
Check the exact error message and run the appropriate SQL fix from above.

## 📋 **Final Verification:**

After running the SQL fix and testing, you should see:
- ✅ Profile pictures upload successfully
- ✅ Images appear in dashboard sidebar
- ✅ Child profile pictures work
- ✅ No more console errors
- ✅ Images persist after page refresh

**If you're still having issues, please share the exact error message from the browser console!**