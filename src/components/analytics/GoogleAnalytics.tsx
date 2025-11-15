'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: false,
            cookie_flags: 'SameSite=Lax;Secure',
            debug_mode: false,
            custom_map: {
              'stream_id': '12995718667'
            }
          });
        `}
      </Script>
    </>
  )
}

// Google Analytics helper functions
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// Event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    custom_map: {
      'stream_id': '12995718667'
    }
  })
}

// Page view tracking
export const trackPageView = (url: string, title: string) => {
  gtag('config', 'G-NBQD7JSPT5', {
    page_location: url,
    page_title: title,
    send_page_view: true,
    custom_map: {
      'stream_id': '12995718667'
    }
  })
}

// User interaction tracking
export const trackUserInteraction = (action: string, element: string) => {
  trackEvent(action, 'User Interaction', element)
}

// Form submission tracking
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'Form', formName)
}

// Navigation tracking
export const trackNavigation = (destination: string) => {
  trackEvent('navigation', 'Navigation', destination)
}

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', 'Conversion', conversionType, value)
}

// Error tracking
export const trackError = (error: string, context: string) => {
  trackEvent('error', 'Error', `${context}: ${error}`)
}

// Language change tracking
export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', 'User Preference', language)
}

// Search tracking
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'User Interaction', searchTerm)
}

// Tutor booking tracking
export const trackTutorBooking = (tutorId: string, value?: number) => {
  trackEvent('tutor_booking', 'Booking', tutorId, value)
}

// Payment tracking
export const trackPayment = (amount: number, paymentMethod: string) => {
  trackEvent('purchase', 'Payment', paymentMethod, amount)
}

// Sign up tracking
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', 'Authentication', method)
}

// Login tracking
export const trackLogin = (method: string) => {
  trackEvent('login', 'Authentication', method)
}