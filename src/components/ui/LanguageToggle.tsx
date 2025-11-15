'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const { trackLanguageToggle } = useAnalytics()

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ms' : 'en'
    setLanguage(newLanguage)
    trackLanguageToggle(newLanguage)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 bg-white shadow-sm"
      title={t('language.toggle')}
    >
      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
        {language === 'en' ? 'EN' : 'MS'}
      </span>
      <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors hidden xs:block sm:block">
        {language === 'en' ? '🇲🇾' : '🇬🇧'}
      </div>
    </button>
  )
}