// Test script to verify Google OAuth configuration
// Run this with: node test-google-oauth.js

const { createClient } = require('@supabase/supabase-js');

// Configuration - replace with your actual values
const supabaseUrl = 'https://o2ys9gbq3-wvjatzwgmcn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im8yeXM5Z2JxMy13dmphdHp3Z21jbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM2OTY1MTc3LCJleHAiOjIwNTI1NDE3Nzd9.7a5S2LWW2Q_twr9l9p3NvBWU5JY-lhQKKnRZUkz4RpY';

async function testGoogleOAuth() {
    console.log('🔄 Testing Google OAuth Configuration...\n');

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized');

    // Check if signInWithOAuth method exists
    if (typeof supabase.auth.signInWithOAuth === 'function') {
        console.log('✅ signInWithOAuth method is available');
    } else {
        console.log('❌ signInWithOAuth method not available');
        return;
    }

    // Test OAuth configuration by attempting to get OAuth URL
    try {
        console.log('🔄 Testing Google OAuth configuration...');

        // This will create the OAuth URL without actually redirecting
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/dashboard',
                skipBrowserRedirect: true // This prevents actual redirect
            }
        });

        if (error) {
            if (error.message.includes('Invalid provider') || error.message.includes('not configured')) {
                console.log('❌ Google provider is not configured in Supabase');
                console.log('💡 Please check your Supabase project settings:');
                console.log('   1. Go to your Supabase project');
                console.log('   2. Navigate to Authentication > Providers');
                console.log('   3. Enable Google provider');
                console.log('   4. Add your Google Client ID and Secret');
            } else {
                console.log('❌ OAuth error:', error.message);
            }
        } else {
            console.log('✅ Google OAuth configuration is working!');
            console.log('📝 OAuth data:', data ? 'OAuth URL generated successfully' : 'No data returned');

            if (data && data.url) {
                console.log('🔗 OAuth URL would redirect to:', data.url.substring(0, 100) + '...');
            }
        }
    } catch (error) {
        console.log('❌ OAuth test failed:', error.message);
    }

    // Test basic Supabase connection
    try {
        console.log('\n🔄 Testing Supabase connection...');
        const { data, error } = await supabase.from('user_settings').select('count', { count: 'exact' });

        if (error) {
            console.log('❌ Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase connection successful');
        }
    } catch (error) {
        console.log('❌ Connection test failed:', error.message);
    }
}

// Additional test to check if the redirect URL is properly configured
async function testRedirectURL() {
    console.log('\n🔄 Testing redirect URL configuration...');

    const redirectURL = 'http://localhost:3000/dashboard';
    console.log('📝 Expected redirect URL:', redirectURL);

    console.log('💡 Make sure this URL is added to your Google OAuth app settings:');
    console.log('   - Go to Google Cloud Console');
    console.log('   - APIs & Services > Credentials');
    console.log('   - Find your OAuth 2.0 Client ID');
    console.log('   - Add this URL to "Authorized redirect URIs"');
}

// Run the tests
testGoogleOAuth()
    .then(() => testRedirectURL())
    .then(() => console.log('\n🎉 Google OAuth test completed!'))
    .catch(error => console.error('Test failed:', error));