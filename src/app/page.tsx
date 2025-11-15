'use client'

import { useState } from 'react'
import Link from 'next/link'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen clean-bg overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 blue-primary rounded-lg"></div>
                <h1 className="text-xl sm:text-2xl font-bold blue-primary-text">EduHome.my</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageToggle />
              <Link
                href="/tutors"
                className="text-slate-700 hover:text-[#106EBE] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('landing.findTutors')}
              </Link>
              <Link
                href="/auth/login"
                className="text-slate-700 hover:text-[#106EBE] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('auth.login')}
              </Link>
              <Link
                href="/auth/signup"
                className="blue-primary text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {t('auth.signup')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/tutors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#106EBE] hover:bg-gray-50 transition-colors"
                >
                  {t('landing.findTutors')}
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#106EBE] hover:bg-gray-50 transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium blue-primary text-white hover:bg-blue-700 transition-all"
                >
                  {t('auth.signup')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold blue-primary-text mb-4 sm:mb-6 leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/auth/signup"
              className="blue-primary text-white hover:bg-blue-700 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              {t('landing.getStartedFree')}
            </Link>
            <Link
              href="/tutors"
              className="border-2 border-[#106EBE] text-[#106EBE] hover:bg-[#106EBE] hover:text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium transition-all w-full sm:w-auto"
            >
              {t('landing.findTutors')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center blue-primary-text mb-8 sm:mb-12 px-4">
            {t('landing.features.title')}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* For Parents */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl card-shadow hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 blue-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('landing.forParents')}</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• {t('landing.trackPerformance')}</li>
                <li>• {t('landing.monitorAttendance')}</li>
                <li>• {t('landing.managePayments')}</li>
                <li>• {t('landing.communication')}</li>
              </ul>
            </div>

            {/* For Tutors */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl card-shadow hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 mint-accent rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('landing.forTutors')}</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• {t('landing.createLessons')}</li>
                <li>• {t('landing.uploadMaterials')}</li>
                <li>• {t('landing.trackSubmissions')}</li>
                <li>• {t('landing.manageStudents')}</li>
              </ul>
            </div>

            {/* For Students */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl card-shadow hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">For Students</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• Access assigned lessons and materials</li>
                <li>• Submit homework online</li>
                <li>• View tutor feedback and grades</li>
                <li>• Track learning milestones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="blue-primary py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-lg sm:text-xl text-white opacity-90 mb-6 sm:mb-8">
            Join thousands of parents, tutors, and students already using EduHome.my
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-[#106EBE] hover:bg-gray-50 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium w-full sm:w-auto inline-block shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Free Journey
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-2 sm:mx-4 lg:mx-8 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 mb-2 sm:mb-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-0 sm:ml-3">
            <p className="text-sm text-green-700 text-center sm:text-left">
              <strong>Platform Ready!</strong> Parent and tutor registration is now live. <Link href="/tutors" className="underline font-medium">Browse tutors</Link> or <Link href="/auth/signup" className="underline font-medium">sign up</Link> to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}