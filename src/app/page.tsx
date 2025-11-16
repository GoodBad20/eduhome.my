'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  Play,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Target,
  Clock,
  Shield,
  Zap,
  Heart,
  MessageSquare,
  Calendar,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const stats = [
    { number: '10,000+', label: 'Active Students', icon: Users },
    { number: '500+', label: 'Expert Tutors', icon: GraduationCap },
    { number: '50,000+', label: 'Lessons Completed', icon: BookOpen },
    { number: '98%', label: 'Satisfaction Rate', icon: Star },
  ]

  const features = [
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Customized lesson plans tailored to each student\'s learning style and pace',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Verified Tutors',
      description: 'All tutors undergo rigorous background checks and qualification verification',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Interactive Sessions',
      description: 'Engaging online lessons with digital whiteboards and real-time collaboration',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work for you with our easy-to-use scheduling system',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor improvement with detailed progress reports and performance analytics',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Dedicated Support',
      description: '24/7 customer support to help you with any questions or issues',
      color: 'from-pink-500 to-rose-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Parent of Form 3 Student',
      content: 'EduHome.my has been a game-changer for my daughter\'s Mathematics. The tutor is patient and the progress tracking helps me see real improvement.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Ahmad Rahman',
      role: 'A-Level Physics Tutor',
      content: 'The platform makes it easy to manage my students and schedule sessions. I\'ve reached more students than ever before!',
      rating: 5,
      avatar: 'AR'
    },
    {
      name: 'Mei Ling',
      role: 'Form 5 Student',
      content: 'I love how I can learn from home! My tutor explains everything clearly and I\'m much more confident for my SPM exams now.',
      rating: 5,
      avatar: 'ML'
    }
  ]

  const subjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Bahasa Melayu', 'History', 'Geography', 'Add Math',
    'Economics', 'Accounting', 'Business Studies'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)

    // Trigger animations when component mounts
    setTimeout(() => setIsVisible(true), 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduHome.my</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageToggle />
              <Link
                href="/tutors"
                className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
              >
                Find Tutors
              </Link>
              <Link
                href="/auth/login"
                className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Sign Up Free
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
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/tutors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Find Tutors
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-20 md:py-24">
        <div className="text-center w-full max-w-5xl mx-auto relative z-10">
          {/* Animated badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Platform Ready
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center">
              <Users className="w-3 h-3 mr-1" />
              10,000+ Students
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              4.9★ Rating
            </span>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>

          <p className={`text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Connect with expert tutors, track progress in real-time, and achieve your academic goals with Malaysia's premier online tutoring platform.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              href="/auth/signup"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tutors"
              className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              Browse Tutors
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={`flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-green-500 mr-1" />
              Verified Tutors
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 text-purple-500 mr-1" />
              Satisfaction Guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="py-16 px-4 sm:px-6 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${
                  currentStat === index ? 'scale-110' : 'scale-100'
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Everything You Need to Succeed
            </h2>
            <p className={`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Powerful features designed to make online tutoring effective, engaging, and convenient for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-blue-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  Learn more <ChevronRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Learn Any Subject
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From primary school to pre-university, we have expert tutors for every subject you need.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {subjects.map((subject, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer hover:scale-105"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from students, parents, and tutors who use EduHome.my
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Limited Time: Get Your First Session Free
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Learning Journey Today
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Malaysian students and parents who trust EduHome.my for quality online tutoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="group bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group border-2 border-white/50 text-white hover:border-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-2 sm:mx-4 lg:mx-8 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-shrink-0 mb-2 sm:mb-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-0 sm:ml-3 text-center sm:text-left">
            <p className="text-sm text-green-700">
              <strong>🎉 Platform Live!</strong> Google OAuth sign-in now available! <Link href="/test-oauth" className="underline font-medium">Test it here</Link> or <Link href="/auth/signup" className="underline font-medium">create your free account</Link> to get started.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}