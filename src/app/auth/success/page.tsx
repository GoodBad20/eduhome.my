'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Account Created Successfully!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for joining EduHome.my! We've sent a confirmation email to your inbox.
          Please check your email and click the confirmation link to activate your account.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You will be redirected to the login page in 5 seconds...
          </p>

          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login Now
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check your email for the confirmation link</li>
            <li>• Click the link to activate your account</li>
            <li>• Sign in with your credentials</li>
            <li>• Complete your profile setup</li>
          </ul>
        </div>
      </div>
    </div>
  )
}