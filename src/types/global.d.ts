// Global type declarations for EduHome.my

// Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer: any[]
    __EDUHOME_USER_ID?: string
  }
}

export {}