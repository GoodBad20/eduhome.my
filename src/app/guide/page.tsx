'use client'

import Link from 'next/link'
import { BookOpen, Users, Calendar, Clock, DollarSign, Shield, MessageSquare, BarChart, ChevronRight, Play, FileText, CheckCircle, AlertCircle, Star, Search, Smartphone } from 'lucide-react'
import { useState } from 'react'

interface GuideSection {
  id: string
  title: string
  description: string
  icon: any
  steps: string[]
  tips?: string[]
}

const sections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to set up your account and start using EduHome.my',
    icon: Users,
    steps: [
      'Create your account by clicking "Sign Up" on the homepage',
      'Choose your role: Parent, Tutor, or Student',
      'Fill in your basic information and verify your email',
      'Complete your profile with additional details',
      'Upload a profile picture to build trust with others'
    ],
    tips: [
      'Use a professional email address that you check regularly',
      'Complete all profile sections to increase visibility',
      'Upload a clear, friendly profile picture'
    ]
  },
  {
    id: 'dashboard-navigation',
    title: 'Dashboard Navigation',
    description: 'Learn how to navigate and use your EduHome dashboard effectively',
    icon: BarChart,
    steps: [
      'Log in to access your personalized dashboard',
      'Use the sidebar navigation to access different sections',
      'Monitor your dashboard statistics and overview cards',
      'Access quick actions from the main dashboard',
      'Use the search bar to find specific information'
    ],
    tips: [
      'Check your dashboard regularly for new messages or assignments',
      'Use the calendar view to see upcoming sessions',
      'Explore all dashboard tabs to discover features'
    ]
  },
  {
    id: 'parent-guide',
    title: 'Parent Guide',
    description: 'Everything parents need to know to manage their child\'s education',
    icon: Users,
    steps: [
      'Add your children to your account with their details',
      'Browse and filter tutors by subject, location, availability',
      'View tutor profiles including qualifications and reviews',
      'Schedule trial sessions with potential tutors',
      'Book regular sessions using our scheduling system',
      'Monitor progress through detailed reports and analytics',
      'Communicate with tutors through our messaging system'
    ],
    tips: [
      'Start with trial sessions to find the best tutor fit',
      'Read recent reviews from other parents',
      'Consider your child\'s learning style when choosing tutors',
      'Schedule sessions at consistent times for better results'
    ]
  },
  {
    id: 'tutor-guide',
    title: 'Tutor Guide',
    description: 'Complete guide for tutors to succeed on EduHome.my',
    icon: BookOpen,
    steps: [
      'Complete your profile with qualifications and experience',
      'Upload teaching credentials and certifications',
      'Set your availability and hourly rates',
      'Create detailed subject descriptions and teaching approaches',
      'Respond promptly to tutoring requests and messages',
      'Prepare lesson plans and materials for sessions',
      'Track student progress and provide regular feedback',
      'Build your reputation through quality teaching'
    ],
    tips: [
      'Be specific about your qualifications and specialties',
      'Set competitive rates based on your experience',
      'Respond to requests within 24 hours',
      'Collect feedback from parents to improve your profile'
    ]
  },
  {
    id: 'scheduling',
    title: 'Scheduling Sessions',
    description: 'Master our scheduling system for seamless lesson management',
    icon: Calendar,
    steps: [
      'Access the Schedule section from your dashboard',
      'View tutor availability in real-time',
      'Select preferred time slots that work for you',
      'Choose session type: online or in-person',
      'Set recurring sessions for regular lessons',
      'Add session notes or special requirements',
      'Confirm bookings and sync with your calendar',
      'Receive automatic reminders before sessions'
    ],
    tips: [
      'Book sessions in advance to secure your preferred times',
      'Set up recurring sessions for regular learning',
      'Enable notifications to never miss a session',
      'Provide clear instructions for in-person sessions'
    ]
  },
  {
    id: 'messaging',
    title: 'Communication & Messaging',
    description: 'Use our messaging system effectively for better communication',
    icon: MessageSquare,
    steps: [
      'Access the Messages section from your dashboard',
      'Start conversations with tutors or parents',
      'Share learning materials and homework assignments',
      'Discuss progress and address concerns',
      'Schedule video calls when needed',
      'Send and receive files and documents',
      'Keep conversation history for reference'
    ],
    tips: [
      'Be clear and concise in your messages',
      'Respond to messages promptly to maintain engagement',
      'Use appropriate tone and language',
      'Keep important information organized and accessible'
    ]
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    description: 'Monitor and analyze educational progress effectively',
    icon: BarChart,
    steps: [
      'Access the Progress section from your dashboard',
      'View session attendance and completion rates',
      'Monitor assignment scores and feedback',
      'Analyze subject-wise performance trends',
      'Download progress reports for sharing',
      'Set learning goals and track achievements',
      'Compare performance over different time periods'
    ],
  },
  {
    id: 'assignments',
    title: 'Assignments & Homework',
    description: 'Manage assignments and track homework completion',
    icon: FileText,
    steps: [
      'Navigate to the Assignments section',
      'View all pending and completed assignments',
      'Download assignment materials and resources',
      'Submit completed work for review',
      'View grades and tutor feedback',
      'Track assignment deadlines and due dates',
      'Communicate with tutors about assignment questions'
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    description: 'Understand and manage payments seamlessly',
    icon: DollarSign,
    steps: [
      'View your current subscription plan',
      'Add payment methods to your account',
      'Make secure payments for tutoring sessions',
      'View payment history and receipts',
      'Set up automatic payments for regular sessions',
      'Understand refund and cancellation policies',
      'Download invoices for expense tracking'
    ],
    tips: [
      'Set up automatic payments to avoid service interruptions',
      'Keep payment methods updated for convenience',
      'Review your billing statements regularly',
      'Contact support for any billing questions'
    ]
  },
  {
    id: 'settings',
    title: 'Settings & Preferences',
    description: 'Customize your account and privacy settings',
    icon: Shield,
    steps: [
      'Access Settings from your dashboard menu',
      'Update your profile information and preferences',
      'Configure notification settings',
      'Manage privacy and visibility controls',
      'Set your timezone and language preferences',
      'Customize your dashboard appearance',
      'Manage password and security settings',
      'Download your personal data if needed'
    ],
    tips: [
      'Enable email notifications for important updates',
      'Keep your profile information up to date',
      'Use strong, unique passwords for security',
      'Regularly review and update your privacy settings'
    ]
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Usage',
    description: 'Use EduHome on your mobile device for on-the-go access',
    icon: Smartphone,
    steps: [
      'Download our mobile app from App Store or Google Play',
      'Log in with your existing account credentials',
      'Access all features from your mobile device',
      'Receive push notifications for messages and reminders',
      'Schedule and manage sessions on the go',
      'Message with tutors and parents anytime, anywhere',
      'View progress reports and assignments from your phone'
    ],
    tips: [
      'Enable notifications to stay updated on important activities',
      'Use biometric login for quick and secure access',
      'Download materials for offline viewing when needed',
      'Keep the app updated for the latest features'
    ]
  }
]

export default function GuidePage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const toggleStepComplete = (sectionId: string, stepIndex: number) => {
    const stepKey = `${sectionId}-${stepIndex}`
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepKey)) {
      newCompleted.delete(stepKey)
    } else {
      newCompleted.add(stepKey)
    }
    setCompletedSteps(newCompleted)
  }

  const getSectionProgress = (section: GuideSection) => {
    const completed = Array.from({ length: section.steps.length }, (_, index) =>
      completedSteps.has(`${section.id}-${index}`)
    ).filter(Boolean).length
    return (completed / section.steps.length) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-12 bg-gradient-to-r from-green-600 to-blue-600">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">User Guide</h1>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Complete guide on how to use EduHome.my tutoring platform effectively
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Guide Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(sections.reduce((acc, section) => acc + getSectionProgress(section), 0) / sections.length)}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10min</div>
              <div className="text-sm text-gray-600">Reading Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-600">Support Available</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <section.icon className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(getSectionProgress(section))}%
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                }`}
                id={section.id}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        <section.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(getSectionProgress(section))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getSectionProgress(section)}%` }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4">
                    {section.steps.map((step, index) => {
                      const isCompleted = completedSteps.has(`${section.id}-${index}`)
                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-3"
                        >
                          <button
                            onClick={() => toggleStepComplete(section.id, index)}
                            className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {isCompleted && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {step}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tips */}
                  {section.tips && section.tips.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Tips
                      </h4>
                      <ul className="space-y-1">
                        {section.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-blue-800">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    <Link
                      href={
                        section.id === 'parent-guide' ? '/dashboard/parent' :
                        section.id === 'tutor-guide' ? '/dashboard/tutor' :
                        section.id === 'settings' ? '/dashboard/parent/settings' :
                        section.id === 'scheduling' ? '/dashboard/parent/schedule' :
                        section.id === 'assignments' ? '/dashboard/parent/assignments' :
                        '/dashboard/parent'
                      }
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Try It Now
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Follow this guide and start making the most of EduHome.my for effective tutoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Sign Up Now
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}