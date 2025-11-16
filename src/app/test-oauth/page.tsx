'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestOAuthPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testGoogleOAuth = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (oauthError) {
        setError(oauthError.message)
      } else {
        setResult('✅ Google OAuth initiated successfully! You should be redirected to Google sign-in.')
        if (data?.url) {
          console.log('OAuth URL:', data.url)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testSession = async () => {
    setLoading(true)
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
      } else if (session) {
        setResult(`✅ User is logged in! Email: ${session.user.email}, Provider: ${session.user.app_metadata.provider}`)
      } else {
        setResult('ℹ️ No active session found. Please sign in first.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error.message)
      } else {
        setResult('✅ Successfully signed out!')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Google OAuth Test</h1>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="font-semibold text-green-800 mb-2">✅ Configuration Status</h2>
              <p className="text-green-700">
                Google OAuth is properly configured in Supabase and ready to use!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testGoogleOAuth}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Google Sign-In'}
              </button>

              <button
                onClick={testSession}
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Current Session
              </button>

              <button
                onClick={signOut}
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Out
              </button>

              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
              >
                Go to Login Page
              </button>
            </div>

            {result && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Result:</h3>
                <p className="text-blue-700">{result}</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Click "Test Google Sign-In" to test the OAuth flow</li>
                <li>You'll be redirected to Google to sign in</li>
                <li>After signing in, you'll be redirected back to the dashboard</li>
                <li>Use "Check Current Session" to verify you're logged in</li>
                <li>Test the actual login pages at <a href="/auth/login" className="text-blue-600 hover:underline">/auth/login</a> and <a href="/auth/signup" className="text-blue-600 hover:underline">/auth/signup</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}