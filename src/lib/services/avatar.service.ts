import { supabase } from '@/lib/supabase';

export class AvatarService {
  private static BUCKET_NAME = 'avatars';

  /**
   * Upload an avatar image for a user
   * @param userId - The user ID
   * @param file - The image file to upload
   * @returns The public URL of the uploaded avatar
   */
  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing avatar
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      // Update user's avatar_url in the database
      await this.updateUserAvatarUrl(userId, data.publicUrl);

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  }

  /**
   * Get the public URL for a user's avatar
   * @param userId - The user ID
   * @returns The public URL of the avatar or null if not found
   */
  static async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      // Look for an avatar file (any file in the user's folder)
      if (data && data.length > 0) {
        const avatarFile = data.find(file =>
          file.name.startsWith('avatar') ||
          file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
        );

        if (avatarFile) {
          const { data: { publicUrl } } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(`${userId}/${avatarFile.name}`);

          return publicUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }
  }

  /**
   * Delete a user's avatar
   * @param userId - The user ID
   */
  static async deleteAvatar(userId: string): Promise<void> {
    try {
      const { data: files } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (files && files.length > 0) {
        const filesToDelete = files.map(file => `${userId}/${file.name}`);

        const { error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove(filesToDelete);

        if (error) {
          console.error('Error deleting avatar:', error);
          throw error;
        }
      }

      // Update user's avatar_url in the database to null
      await this.updateUserAvatarUrl(userId, null);
    } catch (error) {
      console.error('Avatar deletion failed:', error);
      throw error;
    }
  }

  /**
   * Update the avatar_url field in user tables
   * @param userId - The user ID
   * @param avatarUrl - The avatar URL or null
   */
  private static async updateUserAvatarUrl(userId: string, avatarUrl: string | null): Promise<void> {
    try {
      // Update main users table
      const { error: userError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (userError) {
        console.error('Error updating users table:', userError);
        throw userError;
      }

      // Update students table if user is a student
      const { error: studentError } = await supabase
        .from('students')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId);

      if (studentError && studentError.code !== 'PGRST116') {
        // PGRST116 means "no rows found", which is okay if the user is not a student
        console.error('Error updating students table:', studentError);
      }

      // Update tutors table if user is a tutor
      const { error: tutorError } = await supabase
        .from('tutors')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId);

      if (tutorError && tutorError.code !== 'PGRST116') {
        // PGRST116 means "no rows found", which is okay if the user is not a tutor
        console.error('Error updating tutors table:', tutorError);
      }

      // Update tutor_profiles table if it exists and user is a tutor
      try {
        const { error: profileError } = await supabase
          .from('tutor_profiles')
          .update({ avatar_url: avatarUrl })
          .eq('user_id', userId);

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 means "no rows found", which is okay if the user is not a tutor
          console.error('Error updating tutor_profiles table:', profileError);
        }
      } catch (error) {
        // tutor_profiles table might not exist, which is okay
        console.log('tutor_profiles table not found, skipping update');
      }
    } catch (error) {
      console.error('Error updating user avatar URL:', error);
      throw error;
    }
  }

  /**
   * Get a default avatar URL based on user's name
   * @param name - The user's name
   * @returns A default avatar URL
   */
  static getDefaultAvatar(name?: string): string {
    // Generate initials from name
    const initials = name
      ?.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'U';

    // Use a service like DiceBear or UI Avatars for consistent avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128`;
  }

  /**
   * Get the user's avatar URL or a default if none exists
   * @param userId - The user ID
   * @param userName - The user's name for default avatar
   * @returns The avatar URL
   */
  static async getAvatarOrDefault(userId: string, userName?: string): Promise<string> {
    try {
      const avatarUrl = await this.getAvatarUrl(userId);
      return avatarUrl || this.getDefaultAvatar(userName);
    } catch (error) {
      console.error('Error getting avatar or default:', error);
      return this.getDefaultAvatar(userName);
    }
  }
}