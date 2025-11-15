import './globals.css'
import { Inter } from 'next/font/google'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { ToastProvider } from '@/components/ui/Toast'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'EduHome.my - Premier Home Tuition Platform in Malaysia',
    template: '%s | EduHome.my'
  },
  description: 'Connect with expert tutors in Malaysia for personalized home tuition and online learning. Find qualified teachers for all subjects, improve grades, and achieve academic excellence.',
  keywords: ['home tuition malaysia', 'online tuition', 'private tutors', 'malaysia education', 'academic tutoring', 'exam preparation'],
  authors: [{ name: 'EduHome.my' }],
  creator: 'EduHome.my',
  publisher: 'EduHome.my',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.eduhome.my'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EduHome.my - Premier Home Tuition Platform in Malaysia',
    description: 'Connect with expert tutors in Malaysia for personalized home tuition and online learning.',
    url: 'https://www.eduhome.my',
    siteName: 'EduHome.my',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduHome.my - Premier Home Tuition Platform',
      },
    ],
    locale: 'en_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduHome.my - Premier Home Tuition Platform',
    description: 'Connect with expert tutors in Malaysia for personalized learning.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <LanguageProvider>
              <SupabaseProvider>
                {children}
              </SupabaseProvider>
            </LanguageProvider>
          </ToastProvider>
        </ErrorBoundary>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}