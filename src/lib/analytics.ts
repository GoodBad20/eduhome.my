// Google Analytics event tracking utilities

export interface EventParams {
  [key: string]: string | number | boolean
}

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_location: url,
      page_title: title || document.title,
    })
  }
}

// Custom event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventParams: EventParams = {
      event_category: category,
    }

    if (label) eventParams.event_label = label
    if (value !== undefined) eventParams.value = value

    window.gtag('event', action, eventParams)
  }
}

// User interaction events
export const analyticsEvents = {
  // Authentication
  signUp: () => trackEvent('sign_up', 'authentication'),
  login: () => trackEvent('login', 'authentication'),
  logout: () => trackEvent('logout', 'authentication'),

  // Tutor discovery
  tutorProfileView: (tutorId: string) =>
    trackEvent('tutor_profile_view', 'engagement', tutorId),

  searchTutors: (searchTerm: string) =>
    trackEvent('search_tutors', 'engagement', searchTerm),

  // Booking and payments
  initiateBooking: (tutorId: string) =>
    trackEvent('initiate_booking', 'conversion', tutorId),

  completePayment: (amount: number) =>
    trackEvent('purchase', 'conversion', 'lesson_booking', amount),

  // Session management
  scheduleSession: () =>
    trackEvent('schedule_session', 'engagement'),

  cancelSession: (reason: string) =>
    trackEvent('cancel_session', 'engagement', reason),

  // Content engagement
  downloadMaterial: (materialId: string) =>
    trackEvent('download_material', 'engagement', materialId),

  sendMessage: () =>
    trackEvent('send_message', 'engagement'),

  // Profile completion
  updateProfile: (role: 'tutor' | 'parent') =>
    trackEvent('update_profile', 'engagement', role),

  uploadAvatar: () =>
    trackEvent('upload_avatar', 'engagement'),

  // Error tracking
  reportError: (error: string, context?: string) =>
    trackEvent('error', 'error', error),

  // Feature usage
  useFeature: (featureName: string) =>
    trackEvent('use_feature', 'feature_usage', featureName),
}

// User identification
export const identifyUser = (userId: string, userProperties?: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      user_id: userId,
      ...userProperties,
    })
  }
}

// E-commerce tracking
export const trackEcommerceEvent = {
  beginCheckout: (items: Array<{ name: string; price: number; quantity: number }>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'MYR',
        value: items.reduce((total, item) => total + item.price * item.quantity, 0),
        items: items.map(item => ({
          item_name: item.name,
          item_category: 'Tuition Service',
          price: item.price,
          quantity: item.quantity,
        })),
      })
    }
  },

  purchase: (transactionId: string, amount: number, items: Array<{ name: string; price: number; quantity: number }>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'MYR',
        value: amount,
        items: items.map(item => ({
          item_name: item.name,
          item_category: 'Tuition Service',
          price: item.price,
          quantity: item.quantity,
        })),
      })
    }
  }
}

// Performance tracking
export const trackPerformance = (metricName: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: value,
    })
  }
}

// Custom hooks
export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
    events: analyticsEvents,
    identifyUser,
    ecommerce: trackEcommerceEvent,
    performance: trackPerformance,
  }
}