'use client'

import Link from 'next/link'
import { ChevronDown, ChevronUp, Users, Calendar, DollarSign, Shield, Clock, BookOpen, HelpCircle, Star, Search } from 'lucide-react'
import { useState } from 'react'

interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  icon: any
}

const faqs: FAQ[] = [
  // Getting Started
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create an account on EduHome.my?',
    answer: 'Creating an account is simple! Click the "Sign Up" button on our homepage, choose whether you\'re a parent, tutor, or student, and fill in your basic information. You\'ll receive a confirmation email to verify your account.',
    icon: Users
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'Is EduHome.my free to use?',
    answer: 'We offer both free and premium plans. Basic features like browsing tutors and viewing profiles are free. Premium features include unlimited messaging, advanced scheduling, detailed progress reports, and priority support. Premium plans start at RM99/month.',
    icon: DollarSign
  },

  // For Parents
  {
    id: '3',
    category: 'For Parents',
    question: 'How do I find a suitable tutor for my child?',
    answer: 'You can browse our tutor database by subject, location, and availability. Each tutor has a detailed profile including qualifications, experience, reviews, and pricing. Use our advanced filters to narrow down options and schedule trial sessions to find the best match.',
    icon: Search
  },
  {
    id: '4',
    category: 'For Parents',
    question: 'How do I monitor my child\'s progress?',
    answer: 'EduHome.my provides comprehensive progress tracking through our dashboard. You can view session attendance, assignment completion, grades, and tutor feedback. We also send weekly progress reports via email. Parents can also communicate directly with tutors through our messaging system.',
    icon: Star
  },
  {
    id: '5',
    category: 'For Parents',
    question: 'Can I schedule sessions at specific times?',
    answer: 'Yes! Our scheduling system allows you to book sessions at times that work for you. You can view tutor availability in real-time and book recurring sessions (weekly, bi-weekly) or individual sessions. The system handles timezone conversions automatically.',
    icon: Calendar
  },
  {
    id: '6',
    category: 'For Parents',
    question: 'What if I\'m not satisfied with a tutor?',
    answer: 'Your satisfaction is our priority. If you\'re not satisfied with a tutor after the first session, we offer a "Tutor Match Guarantee" - we\'ll help you find a new tutor at no additional cost. You can also change tutors at any time through your dashboard.',
    icon: Shield
  },

  // For Tutors
  {
    id: '7',
    category: 'For Tutors',
    question: 'What qualifications do I need to become a tutor?',
    answer: 'Requirements vary by subject, but generally you need: minimum SPM/STPM qualification with good grades, current enrollment or completion of tertiary education, relevant teaching experience, good communication skills, and passion for education. We\'ll verify your credentials during registration.',
    icon: BookOpen
  },
  {
    id: '8',
    category: 'For Tutors',
    question: 'How much can I earn as a tutor?',
    answer: 'Earnings depend on your qualifications, experience, subject, and location. Our tutors typically earn RM30-80 per hour. Highly qualified tutors in high-demand subjects can earn RM60-120 per hour. You set your own rates and can adjust them as you gain experience.',
    icon: DollarSign
  },
  {
    id: '9',
    category: 'For Tutors',
    question: 'When and how do I get paid?',
    answer: 'Tutors receive payments within 3-5 business days after successful session completion. We use secure payment processing and handle all payment collections from parents. You can track your earnings in real-time through your tutor dashboard.',
    icon: Clock
  },
  {
    id: '10',
    category: 'For Tutors',
    question: 'Do I need to prepare my own teaching materials?',
    answer: 'You can use your own materials or access our library of educational resources. We provide guidelines and templates for lesson planning. Many tutors combine both approaches. We encourage sharing materials within our community while respecting copyright laws.',
    icon: BookOpen
  },

  // Technical Support
  {
    id: '11',
    category: 'Technical Support',
    question: 'What technical requirements do I need for online tutoring?',
    answer: 'For optimal online tutoring experience: stable internet connection (minimum 10 Mbps), webcam, microphone, and a modern web browser. We recommend using Chrome or Firefox. Our platform works on both desktop and mobile devices.',
    icon: HelpCircle
  },
  {
    id: '12',
    category: 'Technical Support',
    question: 'Is my personal information secure?',
    answer: 'Absolutely! We use bank-level SSL encryption for all data transmission. Your personal information is stored securely and is only shared with tutors you specifically engage with. We comply with Malaysia\'s PDPA regulations and never sell your data to third parties.',
    icon: Shield
  },

  // Billing
  {
    id: '13',
    category: 'Billing & Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards, debit cards, FPX, online banking, and e-wallets like Touch \'n Go and GrabPay. All payments are processed securely through our payment partners.',
    icon: DollarSign
  },
  {
    id: '14',
    category: 'Billing & Payments',
    question: 'Can I get a refund for cancelled sessions?',
    answer: 'Our refund policy depends on the cancellation notice: Cancellations made 24+ hours before the session receive a full refund. Cancellations made 12-24 hours before receive a 50% refund. Cancellations made less than 12 hours before the session are non-refundable.',
    icon: Clock
  },

  // Safety
  {
    id: '15',
    category: 'Safety & Security',
    question: 'How do you ensure tutor quality and safety?',
    answer: 'All tutors undergo a thorough verification process including: identity verification, qualification checks, background screening (where applicable), and reference checks. We also monitor tutor performance and encourage feedback from parents and students.',
    icon: Shield
  },
  {
    id: '16',
    category: 'Safety & Security',
    question: 'What should I do if I experience technical issues during a session?',
    answer: 'If you experience technical difficulties: Check your internet connection first, try refreshing the page or restarting your device, ensure your camera and microphone are working, contact our technical support via the Help Center, or message your tutor to reschedule if needed.',
    icon: HelpCircle
  }
]

const categories = Array.from(new Set(faqs.map(faq => faq.category)))

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleAllExpanded = () => {
    if (expandedItems.size > 0) {
      setExpandedItems(new Set())
    } else {
      setExpandedItems(new Set(filteredFaqs.map(faq => faq.id)))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Find answers to common questions about EduHome.my tutoring platform
              </p>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleAllExpanded}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  {expandedItems.size > 0 ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Expand All
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories ({faqs.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                  <span className="ml-1 text-xs">
                    ({faqs.filter(faq => faq.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <faq.icon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {faq.category}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedItems.has(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {expandedItems.has(faq.id) && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Contact Support
            </Link>
            <Link
              href="/dashboard/parent/settings"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}