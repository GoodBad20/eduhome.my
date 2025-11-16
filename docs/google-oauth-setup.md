# Google OAuth Setup for EduHome.my

This document outlines the steps required to configure Google OAuth with Supabase for EduHome.my.

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret

## 2. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" in the list
4. Enable the Google provider
5. Enter the Client ID and Client Secret from Google Cloud Console
6. Save the configuration

## 3. Environment Variables (Optional)

If needed, add these to your environment:

```bash
# These are typically managed in Supabase dashboard, not in .env files
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 4. Frontend Implementation

The frontend implementation is already completed in:

- `/src/app/auth/login/page.tsx` - Google sign-in button and handler
- `/src/app/auth/signup/page.tsx` - Google sign-up button and handler

## 5. Testing

Once configured, users can:
1. Click "Sign in with Google" on the login page
2. Click "Sign up with Google" on the signup page
3. Complete Google authentication flow
4. Be redirected to the dashboard

## 6. Security Considerations

- Ensure your Google OAuth redirect URIs are properly configured
- Use HTTPS in production
- Regularly rotate client secrets
- Monitor for suspicious authentication attempts

## 7. Troubleshooting

Common issues:
- "redirect_uri_mismatch" - Check redirect URI in Google Console
- "invalid_client" - Verify client ID and secret
- "access_denied" - User denied permission or OAuth consent screen not configured

## Current Status

✅ Frontend implementation completed
✅ Button handlers implemented
⚠️ Requires Google Cloud Console configuration
⚠️ Requires Supabase provider configuration

Next Steps:
1. Complete Google Cloud Console setup
2. Configure Google provider in Supabase
3. Test OAuth flow
4. Deploy to production