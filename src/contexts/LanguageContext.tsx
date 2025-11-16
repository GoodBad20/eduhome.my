'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ms'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

interface Translations {
  [key: string]: {
    en: string
    ms: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ms: 'Utama' },
  'nav.dashboard': { en: 'Dashboard', ms: 'Papan Pemuka' },
  'nav.profile': { en: 'Profile', ms: 'Profil' },
  'nav.settings': { en: 'Settings', ms: 'Tetapan' },
  'nav.messages': { en: 'Messages', ms: 'Mesej' },
  'nav.logout': { en: 'Sign Out', ms: 'Daftar Keluar' },

  // Auth
  'auth.login': { en: 'Sign In', ms: 'Log Masuk' },
  'auth.signup': { en: 'Sign Up', ms: 'Daftar' },
  'auth.email': { en: 'Email Address', ms: 'Alamat Emel' },
  'auth.password': { en: 'Password', ms: 'Kata Laluan' },
  'auth.forgotPassword': { en: 'Forgot Password?', ms: 'Lupa Kata Laluan?' },
  'auth.rememberMe': { en: 'Remember me', ms: 'Ingat saya' },
  'auth.loginButton': { en: 'Sign In', ms: 'Log Masuk' },
  'auth.signupButton': { en: 'Create Account', ms: 'Cipta Akaun' },
  'auth.fullName': { en: 'Full Name', ms: 'Nama Penuh' },
  'auth.confirmPassword': { en: 'Confirm Password', ms: 'Sahkan Kata Laluan' },
  'auth.iAmA': { en: 'I am a...', ms: 'Saya seorang...' },
  'auth.parent': { en: 'Parent', ms: 'Ibu Bapa' },
  'auth.tutor': { en: 'Tutor', ms: 'Tuisyen' },

  // Language
  'language.toggle': { en: 'Toggle language', ms: 'Tukar bahasa' },
  'language.english': { en: 'English', ms: 'Bahasa Inggeris' },
  'language.malay': { en: 'Malay', ms: 'Bahasa Melayu' },

  // Landing Page
  'landing.title': { en: 'Find the Perfect Tutor for Your Child', ms: 'Cari Guru Tuisyen Terbaik untuk Anak Anda' },
  'landing.subtitle': { en: 'Connect with experienced tutors across Malaysia', ms: 'Hubungkan dengan guru tuisyen berpengalaman di seluruh Malaysia' },
  'landing.getStarted': { en: 'Get Started', ms: 'Mula Sekarang' },
  'landing.learnMore': { en: 'Learn More', ms: 'Ketahui Lebih Lanjut' },
  'landing.findTutors': { en: 'Find Tutors', ms: 'Cari Guru Tuisyen' },
  'landing.becomeTutor': { en: 'Become a Tutor', ms: 'Jadi Guru Tuisyen' },
  'landing.getStartedFree': { en: 'Get Started Free', ms: 'Mula Percuma' },
  'landing.features.title': { en: 'Everything You Need for Effective Home Learning', ms: 'Segala-galanya yang Anda Perlukan untuk Pembelajaran Di Rumah yang Berkesan' },
  'landing.forParents': { en: 'For Parents', ms: 'Untuk Ibu Bapa' },
  'landing.forTutors': { en: 'For Tutors', ms: 'Untuk Guru Tuisyen' },
  'landing.trackPerformance': { en: 'Track child\'s performance and progress', ms: 'Jejaki prestasi dan kemajuan anak' },
  'landing.monitorAttendance': { en: 'Monitor lesson attendance and schedules', ms: 'Pantau kehadiran dan jadual kelas' },
  'landing.managePayments': { en: 'Manage payments and lesson credits', ms: 'Uruskan pembayaran dan kredit kelas' },
  'landing.communication': { en: 'Direct communication with tutors', ms: 'Komunikasi langsung dengan guru tuisyen' },
  'landing.createLessons': { en: 'Create and assign lessons easily', ms: 'Cipta dan tugaskan kelas dengan mudah' },
  'landing.uploadMaterials': { en: 'Upload learning materials', ms: 'Muat naik bahan pembelajaran' },
  'landing.trackSubmissions': { en: 'Track student submissions', ms: 'Jejaki penyerahan pelajar' },
  'landing.manageStudents': { en: 'Manage multiple students efficiently', ms: 'Uruskan pelajar berbilang dengan cekap' },
  'landing.cta.title': { en: 'Ready to Start Learning?', ms: 'Sedia untuk Mula Belajar?' },
  'landing.cta.subtitle': { en: 'Join thousands of parents and tutors using EduHome.my', ms: 'Sertai ribuan ibu bapa dan guru tuisyen yang menggunakan EduHome.my' },
  'landing.hero.title': { en: 'Transform Home Learning', ms: 'Transformasikan Pembelajaran Di Rumah' },
  'landing.hero.subtitle': { en: 'Connect parents, tutors, and students on a single platform for seamless online learning management, progress tracking, and communication.', ms: 'Hubungkan ibu bapa, guru tuisyen, dan pelajar pada satu platform untuk pengurusan pembelajaran dalam talian yang lancar, penjejakan kemajuan, dan komunikasi.' },

  // New Landing Page Content
  'landing.new.title': { en: 'Transform Your Learning Journey', ms: 'Transformasikan Perjalanan Pembelajaran Anda' },
  'landing.new.subtitle': { en: 'Connect with expert tutors, track progress in real-time, and achieve your academic goals with Malaysia\'s premier online tutoring platform.', ms: 'Hubungkan dengan guru tuisyen pakar, jejak kemajuan dalam masa nyata, dan capai matlamat akademik anda dengan platform tuisyen dalam talian utama Malaysia.' },
  'landing.getStartedFree': { en: 'Get Started Free', ms: 'Mula Percuma' },
  'landing.browseTutors': { en: 'Browse Tutors', ms: 'Layar Guru Tuisyen' },
  'landing.verifiedTutors': { en: 'Verified Tutors', ms: 'Guru Tuisyen Disahkan' },
  'landing.support24_7': { en: '24/7 Support', ms: 'Sokongan 24/7' },
  'landing.satisfactionGuaranteed': { en: 'Satisfaction Guaranteed', ms: 'Kepuasan Dijamin' },
  'landing.personalizedLearning': { en: 'Personalized Learning', ms: 'Pembelajaran Diperibadikan' },
  'landing.personalizedLearningDesc': { en: 'Customized lesson plans tailored to each student\'s learning style and pace', ms: 'Rancangan pelajaran disesuaikan mengikut gaya dan kadar pembelajaran setiap pelajar' },
  'landing.verifiedTutors2': { en: 'Verified Tutors', ms: 'Guru Tuisyen Disahkan' },
  'landing.verifiedTutorsDesc': { en: 'All tutors undergo rigorous background checks and qualification verification', ms: 'Semua guru tuisyen melalui pemeriksaan latar belakang dan pengesahan kelayakan yang ketat' },
  'landing.interactiveSessions': { en: 'Interactive Sessions', ms: 'Sesi Interaktif' },
  'landing.interactiveSessionsDesc': { en: 'Engaging online lessons with digital whiteboards and real-time collaboration', ms: 'Kelas dalam talian yang menarik dengan papan putih digital dan kerjasama masa nyata' },
  'landing.flexibleScheduling': { en: 'Flexible Scheduling', ms: 'Jadual Fleksibel' },
  'landing.flexibleSchedulingDesc': { en: 'Book sessions at times that work for you with our easy-to-use scheduling system', ms: 'Tempah sesi pada masa yang sesuai untuk anda dengan sistem penjadualan yang mudah digunakan' },
  'landing.progressTracking': { en: 'Progress Tracking', ms: 'Penjejakan Kemajuan' },
  'landing.progressTrackingDesc': { en: 'Monitor improvement with detailed progress reports and performance analytics', ms: 'Pantau peningkatan dengan laporan kemajuan terperinci dan analitik prestasi' },
  'landing.dedicatedSupport': { en: 'Dedicated Support', ms: 'Sokongan Tumpuan' },
  'landing.dedicatedSupportDesc': { en: '24/7 customer support to help you with any questions or issues', ms: 'Sokongan pelanggan 24/7 untuk membantu anda dengan sebarang soalan atau isu' },
  'landing.learnAnySubject': { en: 'Learn Any Subject', ms: 'Belajar Sebarang Mata Pelajaran' },
  'landing.learnAnySubjectDesc': { en: 'From primary school to pre-university, we have expert tutors for every subject you need.', ms: 'Dari sekolah rendah hingga pra-universiti, kami mempunyai guru tuisyen pakar untuk setiap mata pelajaran yang anda perlukan.' },
  'landing.whatUsersSay': { en: 'What Our Users Say', ms: 'Apa Kata Pengguna Kami' },
  'landing.whatUsersSayDesc': { en: 'Real experiences from students, parents, and tutors who use EduHome.my', ms: 'Pengalaman sebenar dari pelajar, ibu bapa, dan guru tuisyen yang menggunakan EduHome.my' },
  'landing.startLearningJourney': { en: 'Start Your Learning Journey Today', ms: 'Mula Perjalanan Pembelajaran Anda Hari Ini' },
  'landing.startLearningJourneyDesc': { en: 'Join thousands of Malaysian students and parents who trust EduHome.my for quality online tutoring.', ms: 'Sertai ribuan pelajar dan ibu bapa Malaysia yang mempercayai EduHome.my untuk tuisyen dalam talian berkualiti.' },
  'landing.limitedTimeOffer': { en: 'Limited Time: Get Your First Session Free', ms: 'Masa Terhad: Dapatkan Sesi Percuma Pertama Anda' },
  'landing.watchDemo': { en: 'Watch Demo', ms: 'Tonton Demo' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome back', ms: 'Selamat kembali' },
  'dashboard.goodToSeeYou': { en: 'Good to see you', ms: 'Gembira melihat anda' },
  'dashboard.menu.main': { en: 'Main', ms: 'Utama' },
  'dashboard.menu.family': { en: 'Family', ms: 'Keluarga' },
  'dashboard.menu.learning': { en: 'Learning', ms: 'Pembelajaran' },
  'dashboard.menu.account': { en: 'Account', ms: 'Akaun' },
  'dashboard.menu.overview': { en: 'Overview', ms: 'Gambaran Keseluruhan' },
  'dashboard.menu.teaching': { en: 'Teaching', ms: 'Pengajaran' },
  'dashboard.menu.business': { en: 'Business', ms: 'Perniagaan' },

  // Parent Dashboard
  'parent.myKids': { en: 'My Kids', ms: 'Anak Saya' },
  'parent.progress': { en: 'Progress', ms: 'Kemajuan' },
  'parent.schedule': { en: 'Schedule', ms: 'Jadual' },
  'parent.lessons': { en: 'Lessons', ms: 'Kelas' },
  'parent.assignments': { en: 'Assignments', ms: 'Tugasan' },
  'parent.findTutors': { en: 'Find Tutors', ms: 'Cari Guru Tuisyen' },
  'parent.payments': { en: 'Payments', ms: 'Bayaran' },

  // Tutor Dashboard
  'tutor.students': { en: 'Students', ms: 'Pelajar' },
  'tutor.schedule': { en: 'Schedule', ms: 'Jadual' },
  'tutor.lessons': { en: 'Lessons', ms: 'Kelas' },
  'tutor.assignments': { en: 'Assignments', ms: 'Tugasan' },
  'tutor.earnings': { en: 'Earnings', ms: 'Pendapatan' },
  'tutor.analytics': { en: 'Analytics', ms: 'Analitik' },

  // Common
  'common.loading': { en: 'Loading...', ms: 'Sedang dimuatkan...' },
  'common.save': { en: 'Save', ms: 'Simpan' },
  'common.cancel': { en: 'Cancel', ms: 'Batal' },
  'common.edit': { en: 'Edit', ms: 'Edit' },
  'common.delete': { en: 'Delete', ms: 'Padam' },
  'common.view': { en: 'View', ms: 'Lihat' },
  'common.search': { en: 'Search...', ms: 'Cari...' },
  'common.filter': { en: 'Filter', ms: 'Tapis' },
  'common.submit': { en: 'Submit', ms: 'Hantar' },
  'common.close': { en: 'Close', ms: 'Tutup' },
  'common.open': { en: 'Open', ms: 'Buka' },
  'common.yes': { en: 'Yes', ms: 'Ya' },
  'common.no': { en: 'No', ms: 'Tidak' },
  'common.ok': { en: 'OK', ms: 'OK' },
  'common.error': { en: 'Error', ms: 'Ralat' },
  'common.success': { en: 'Success', ms: 'Berjaya' },
  'common.warning': { en: 'Warning', ms: 'Amaran' },
  'common.info': { en: 'Info', ms: 'Maklumat' },

  // Admin
  'admin.dashboard': { en: 'Admin Dashboard', ms: 'Papan Pemuka Admin' },
  'admin.users': { en: 'Users', ms: 'Pengguna' },
  'admin.analytics': { en: 'Analytics', ms: 'Analitik' },
  'admin.settings': { en: 'Settings', ms: 'Tetapan' },
  'admin.totalUsers': { en: 'Total Users', ms: 'Jumlah Pengguna' },
  'admin.totalTutors': { en: 'Total Tutors', ms: 'Jumlah Guru Tuisyen' },
  'admin.totalBookings': { en: 'Total Bookings', ms: 'Jumlah Tempahan' },
  'admin.totalRevenue': { en: 'Total Revenue', ms: 'Jumlah Pendapatan' },

  // Forms
  'form.required': { en: 'This field is required', ms: 'Medan ini diperlukan' },
  'form.invalidEmail': { en: 'Invalid email address', ms: 'Alamat emel tidak sah' },
  'form.passwordTooShort': { en: 'Password must be at least 6 characters', ms: 'Kata Laluan mesti sekurang-kurangnya 6 aksara' },
  'form.passwordMismatch': { en: 'Passwords do not match', ms: 'Kata Laluan tidak sepadan' },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation key "${key}" not found`)
      return key
    }
    return translation[language] || translation.en || key
  }

  useEffect(() => {
    // Get saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') as Language | null

    // Try to get browser language
    const browserLanguage = navigator.language.split('-')[0] as Language
    const isMalay = browserLanguage === 'ms'

    // Set language: saved > browser > default (English)
    const initialLanguage = savedLanguage || (isMalay ? 'ms' : 'en')

    setLanguage(initialLanguage)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}