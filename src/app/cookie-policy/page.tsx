'use client'

import Link from 'next/link'
import { Cookie, Shield, Eye, Settings, ExternalLink, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const cookieSections = [
  {
    id: 'what-are-cookies',
    title: 'What Are Cookies?',
    icon: Cookie,
    content: [
      {
        type: 'text',
        content: 'Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.'
      },
      {
        type: 'text',
        content: 'Cookies are essential for many modern websites to function properly. They help us remember your preferences, understand how you use our site, and provide personalized content.'
      }
    ]
  },
  {
    id: 'how-we-use-cookies',
    title: 'How We Use Cookies',
    icon: Settings,
    content: [
      {
        type: 'text',
        content: 'We use cookies for several purposes to enhance your experience on EduHome.my:'
      },
      {
        type: 'list',
        items: [
          'Essential Cookies: Required for basic website functionality and security',
          'Authentication Cookies: Keep you logged in and remember your preferences',
          'Analytics Cookies: Help us understand how visitors interact with our site',
          'Marketing Cookies: Used to show relevant advertisements and track marketing campaigns',
          'Functional Cookies: Remember your settings and preferences (language, timezone, etc.)',
          'Session Cookies: Maintain your session as you navigate through the platform'
        ]
      }
    ]
  },
  {
    id: 'cookie-types',
    title: 'Types of Cookies We Use',
    icon: Eye,
    content: [
      {
        type: 'table',
        headers: ['Cookie Type', 'Purpose', 'Duration'],
        rows: [
          ['Authentication', 'Maintains login state and user session', 'Session + 30 days'],
          ['Preferences', 'Stores user settings like language and timezone', '1 year'],
          ['Analytics', 'Tracks site usage and performance metrics', '2 years'],
          ['Marketing', 'Personalizes ads and tracks campaign effectiveness', '90 days'],
          ['Security', 'Protects against fraud and unauthorized access', 'Session'],
          ['Functional', 'Enables advanced features like video calls', 'Session']
        ]
      }
    ]
  },
  {
    id: 'third-party-cookies',
    title: 'Third-Party Cookies',
    icon: ExternalLink,
    content: [
      {
        type: 'text',
        content: 'We use trusted third-party services that may set their own cookies on your device. These include:'
      },
      {
        type: 'list',
        items: [
          'Google Analytics: For website traffic analysis and user behavior insights',
          'Supabase: For authentication and database management',
          'Vercel: For hosting and performance monitoring',
          'Payment Processors: For secure payment processing',
          'Video Conference Tools: For online tutoring sessions',
          'Email Services: For communication and notifications'
        ]
      },
      {
        type: 'text',
        content: 'These third-party providers have their own privacy policies and are responsible for their own cookie usage. We only work with reputable companies that comply with applicable privacy laws.'
      }
    ]
  },
  {
    id: 'managing-cookies',
    title: 'Managing Your Cookie Preferences',
    icon: Settings,
    content: [
      {
        type: 'text',
        content: 'You have several options to manage cookies on EduHome.my:'
      },
      {
        type: 'list',
        items: [
          'Cookie Consent Banner: Set your preferences when you first visit our site',
          'Browser Settings: Block or delete cookies through your browser preferences',
          'Cookie Settings: Update your preferences anytime in your dashboard settings',
          'Device Settings: Manage cookies at the operating system level',
          'Opt-Out Links: Use provided opt-out tools for specific cookies'
        ]
      },
      {
        type: 'warning',
        content: 'Please note that blocking essential cookies may prevent some parts of our website from functioning properly, potentially affecting your user experience.'
      }
    ]
  },
  {
    id: 'cookie-lifespan',
    title: 'Cookie Lifespan',
    icon: Clock,
    content: [
      {
        type: 'text',
        content: 'Different types of cookies have different lifespans on your device:'
      },
      {
        type: 'list',
        items: [
          'Session Cookies: Expire when you close your browser (typically 30 minutes of inactivity)',
          'Persistent Cookies: Remain on your device until they expire or are deleted',
          'Authentication Cookies: Usually last 30 days to maintain convenient access',
          'Analytics Cookies: Typically 1-2 years for long-term trend analysis',
          'Preference Cookies: Often 1 year to remember your settings'
        ]
      }
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Rights Regarding Cookies',
    icon: Shield,
    content: [
      {
        type: 'text',
        content: 'Under GDPR and other privacy regulations, you have the right to:'
      },
      {
        type: 'list',
        items: [
          'Be informed about what cookies are being used and why',
          'Grant or withdraw consent for non-essential cookies',
          'Access and request deletion of your personal data',
          'Restrict processing of your data in certain circumstances',
          'Data portability - request your data in a machine-readable format',
          'Complain to a supervisory authority if you believe your rights have been violated'
        ]
      }
    ]
  },
  {
    id: 'international-users',
    title: 'International Users',
    icon: ExternalLink,
    content: [
      {
        type: 'text',
        content: 'EduHome.my operates globally and complies with multiple privacy regulations including:'
      },
      {
        type: 'list',
        items: [
          'GDPR (General Data Protection Regulation) for EU users',
          'PDPA (Personal Data Protection Act) for Malaysian users',
          'CCPA (California Consumer Privacy Act) for California users',
          'Various other regional privacy laws'
        ]
      },
      {
        type: 'text',
        content: 'International data transfers are protected using appropriate safeguards including Standard Contractual Clauses and adherence to recognized frameworks.'
      }
    ]
  },
  {
    id: 'updates-changes',
    title: 'Updates to This Policy',
    icon: AlertTriangle,
    content: [
      {
        type: 'text',
        content: 'We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or the technologies we use. Significant changes will be communicated through:'
      },
      {
        type: 'list',
        items: [
          'Email notifications to registered users',
          'Website banners or notifications',
          'Updated "Last Modified" date at the top of this policy',
          'Blog posts or announcements for major changes'
        ]
      },
      {
        type: 'text',
        content: 'We encourage you to review this policy periodically to stay informed about our use of cookies and your rights.'
      }
    ]
  }
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-12 bg-gradient-to-r from-amber-600 to-orange-600">
            <div className="text-center">
              <Cookie className="h-16 w-16 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Learn how EduHome.my uses cookies and similar technologies to enhance your experience
              </p>
              <div className="mt-6 text-sm text-amber-100">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-amber-50 border-b border-amber-200">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.open('/dashboard/parent/settings', '_blank')}
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Cookie Preferences
              </button>
              <Link
                href="/privacy"
                className="inline-flex items-center px-4 py-2 bg-white text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center px-4 py-2 bg-white text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {cookieSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {section.content.map((content, index) => {
                  if (content.type === 'text') {
                    return (
                      <p key={index} className="text-gray-600 leading-relaxed">
                        {content.content}
                      </p>
                    )
                  } else if (content.type === 'list') {
                    return (
                      <ul key={index} className="space-y-2">
                        {content.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  } else if (content.type === 'table') {
                    return (
                      <div key={index} className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 rounded-lg">
                          <thead>
                            <tr className="bg-gray-50">
                              {content.headers.map((header, headerIndex) => (
                                <th key={headerIndex} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {content.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  } else if (content.type === 'warning') {
                    return (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-yellow-800">{content.content}</p>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Information */}
        <div className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Compliance & Contact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
              <ul className="space-y-1 text-amber-100 text-sm">
                <li>• GDPR Compliant (EU General Data Protection Regulation)</li>
                <li>• PDPA Compliant (Malaysia Personal Data Protection Act 2010)</li>
                <li>• CCPA Compliant (California Consumer Privacy Act)</li>
                <li>• ISO 27001 Information Security Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <ul className="space-y-1 text-amber-100 text-sm">
                <li>• Email: privacy@eduhome.my</li>
                <li>• Phone: +60 3-1234 5678</li>
                <li>• Address: 123 Jalan Edu, Kuala Lumpur, Malaysia</li>
                <li>• DPO Contact: dpo@eduhome.my</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Cookie className="h-4 w-4 mr-2" />
            Back to Top
          </button>
        </div>
      </div>
    </div>
  )
}