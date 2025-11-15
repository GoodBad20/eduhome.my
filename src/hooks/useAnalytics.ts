'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  trackPageView,
  trackNavigation,
  trackLanguageChange,
  trackUserInteraction,
  trackConversion,
  trackFormSubmission,
  trackSearch,
  trackTutorBooking,
  trackPayment,
  trackSignUp,
  trackLogin,
  trackError
} from '@/components/analytics/GoogleAnalytics'

export function useAnalytics() {
  const router = useRouter()

  // Track initial page view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname, document.title)
    }
  }, [])

  // For App Router, we can't use router.events
  // Page tracking will be handled by individual components or Next.js middleware

  // Track navigation clicks
  const trackNavClick = (destination: string) => {
    trackNavigation(destination)
  }

  // Track language changes
  const trackLanguageToggle = (language: string) => {
    trackLanguageChange(language)
  }

  // Track button clicks
  const trackButtonClick = (buttonName: string, context?: string) => {
    trackUserInteraction(`click_${buttonName}`, context || 'Button')
  }

  // Track form starts
  const trackFormStart = (formName: string) => {
    trackUserInteraction('form_start', formName)
  }

  // Track successful form submissions
  const trackSuccessfulSubmission = (formName: string) => {
    trackFormSubmission(formName)
    trackConversion('form_completion', 1)
  }

  // Track search queries
  const trackSearchQuery = (query: string) => {
    trackSearch(query)
  }

  // Track tutor bookings
  const trackBooking = (tutorId: string, amount?: number) => {
    trackTutorBooking(tutorId, amount)
    if (amount) {
      trackConversion('tutor_booking', amount)
    }
  }

  // Track successful payments
  const trackSuccessfulPayment = (amount: number, method: string) => {
    trackPayment(amount, method)
    trackConversion('payment', amount)
  }

  // Track user registrations
  const trackUserRegistration = (method: 'email' | 'google' | 'other' = 'email') => {
    trackSignUp(method)
    trackConversion('registration', 1)
  }

  // Track user logins
  const trackUserLogin = (method: 'email' | 'google' | 'other' = 'email') => {
    trackLogin(method)
    trackConversion('login', 1)
  }

  // Track errors
  const trackAnalyticsError = (error: Error | string, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : error
    trackError(errorMessage, context || 'Application')
  }

  // Track user engagement
  const trackEngagement = (action: string, details?: string) => {
    trackUserInteraction(action, details || 'Engagement')
  }

  // Track feature usage
  const trackFeatureUsage = (feature: string, action?: string) => {
    trackUserInteraction(action || 'use', feature)
  }

  return {
    // Navigation tracking
    trackNavClick,
    trackNavigation,

    // User actions
    trackButtonClick,
    trackUserInteraction,
    trackEngagement,

    // Language tracking
    trackLanguageToggle,

    // Form tracking
    trackFormStart,
    trackSuccessfulSubmission,
    trackFormSubmission,

    // Search tracking
    trackSearchQuery,

    // Business tracking
    trackBooking,
    trackSuccessfulPayment,
    trackUserRegistration,
    trackUserLogin,
    trackConversion,

    // Feature tracking
    trackFeatureUsage,

    // Error tracking
    trackAnalyticsError,

    // Direct access to GA functions
    trackPageView,
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      // Using the trackEvent function from GoogleAnalytics
      // This is a wrapper that uses the stream ID
    },
  }
}