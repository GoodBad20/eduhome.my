'use client'

import Link from 'next/link'
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  BookOpen,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Shield
} from 'lucide-react'

const contactOptions = [
  {
    title: 'Live Chat Support',
    description: 'Chat with our support team in real-time for immediate assistance',
    icon: MessageSquare,
    availability: '24/7 Available',
    action: 'Start Chat',
    link: '/chat',
    priority: 'high'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed email and we\'ll respond within 24 hours',
    icon: Mail,
    availability: 'Response within 24 hours',
    action: 'Send Email',
    link: 'mailto:support@eduhome.my',
    priority: 'medium'
  },
  {
    title: 'Phone Support',
    description: 'Call us for urgent issues during business hours',
    icon: Phone,
    availability: 'Mon-Fri, 9AM-6PM (MYT)',
    action: '+60 3-1234 5678',
    link: 'tel:+60312345678',
    priority: 'high'
  },
  {
    title: 'Help Center',
    description: 'Browse our comprehensive knowledge base and FAQs',
    icon: HelpCircle,
    availability: 'Always Available',
    action: 'Browse Articles',
    link: '/faq',
    priority: 'low'
  }
]

const supportCategories = [
  {
    title: 'Account & Login Issues',
    description: 'Problems with account access, password reset, or profile settings',
    commonIssues: [
      'Can\'t log in to my account',
      'Forgot password or username',
      'Profile information is incorrect',
      'Account suspension or restrictions',
      'Two-factor authentication problems'
    ]
  },
  {
    title: 'Booking & Scheduling',
    description: 'Issues related to booking sessions, managing schedules, or cancellations',
    commonIssues: [
      'Can\'t book a tutoring session',
      'Schedule conflicts or double bookings',
      'Cancellation policy questions',
      'Tutor availability issues',
      'Payment processing problems'
    ]
  },
  {
    title: 'Technical Problems',
    description: 'Platform functionality, app crashes, or connectivity issues',
    commonIssues: [
      'Video call not working',
      'App keeps crashing or freezing',
      'Slow loading or performance issues',
      'Files not uploading properly',
      'Mobile app compatibility problems'
    ]
  },
  {
    title: 'Billing & Payments',
    description: 'Payment processing, refunds, subscription management',
    commonIssues: [
      'Payment was declined or failed',
      'Requesting a refund',
      'Subscription plan changes',
      'Invoice or receipt requests',
      'Payment method issues'
    ]
  },
  {
    title: 'Safety & Security',
    description: 'Report suspicious activity, safety concerns, or privacy issues',
    commonIssues: [
      'Inappropriate tutor behavior',
      'Account security concerns',
      'Data privacy questions',
      'Reporting suspicious users',
      'Child safety concerns'
    ]
  },
  {
    title: 'General Inquiries',
    description: 'Other questions not covered by specific categories',
    commonIssues: [
      'Partnership or collaboration opportunities',
      'Media or press inquiries',
      'Career opportunities',
      'Feedback or suggestions',
      'Other general questions'
    ]
  }
]

const emergencyContacts = [
  {
    title: 'Urgent Safety Concerns',
    description: 'For immediate safety issues or emergencies',
    contact: 'Call emergency services: 999',
    priority: 'critical'
  },
  {
    title: 'Child Protection',
    description: 'Report child safety concerns',
    contact: 'Childline Malaysia: 15999',
    priority: 'critical'
  },
  {
    title: 'Mental Health Support',
    description: 'Get immediate mental health assistance',
    contact: 'Befrienders Kuala Lumpur: 03-7627 2929',
    priority: 'high'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="text-center">
              <HelpCircle className="h-16 w-16 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">Contact Support</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Get help and support from the EduHome.my team
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Live Chat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                &lt;24h
              </div>
              <div className="text-sm text-gray-600">Email Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.8★</div>
              <div className="text-sm text-gray-600">Support Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">10k+</div>
              <div className="text-sm text-gray-600">Issues Resolved</div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            Emergency Contacts
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {emergencyContacts.map((emergency, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-700 mb-1">{emergency.title}</h3>
                <p className="text-sm text-red-600 mb-2">{emergency.description}</p>
                <p className="text-lg font-bold text-red-800">{emergency.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                option.priority === 'high' ? 'bg-red-100' :
                option.priority === 'medium' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <option.icon className={`h-6 w-6 ${
                  option.priority === 'high' ? 'text-red-600' :
                  option.priority === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{option.description}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Clock className="h-3 w-3 mr-1" />
                {option.availability}
              </div>
              <Link
                href={option.link}
                className="inline-flex items-center w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {option.action}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Link>
            </div>
          ))}
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Issues & Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.commonIssues.map((issue, issueIndex) => (
                    <li key={issueIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((category, index) => (
                    <option key={index} value={category.title}>{category.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Feature request or minor issue</option>
                  <option value="high">High - Important issue affecting usage</option>
                  <option value="urgent">Urgent - Critical issue requiring immediate attention</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible about your issue..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="attachments"
                name="attachments"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="attachments" className="ml-2 block text-sm text-gray-700">
                I have screenshots or files to share (we'll request them via email)
              </label>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* Office Information */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Visit Our Office</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </h3>
              <address className="text-gray-300 not-italic">
                EduHome.my Headquarters<br />
                123 Jalan Edu, Bangsar<br />
                59100 Kuala Lumpur<br />
                Malaysia
              </address>
            </div>
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Office Hours
              </h3>
              <div className="text-gray-300 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="text-sm mt-2">Emergency support available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Before contacting us, you might find helpful:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/faq"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              User Guide
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}