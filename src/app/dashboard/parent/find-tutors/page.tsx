'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function FindTutorsPage() {
  const { user } = useSupabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null)

  const mockTutors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@example.com',
      qualification: 'Ph.D. in Mathematics',
      experience: 8,
      hourly_rate: 80,
      subjects: ['Mathematics', 'Additional Mathematics'],
      location: 'Kuala Lumpur',
      rating: 4.9,
      reviews_count: 127,
      students_count: 45,
      about: 'Passionate mathematics educator with 8 years of experience teaching SPM and IGCSE students. Specialized in helping students build strong foundations in mathematical concepts.',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false
      },
      languages: ['English', 'Mandarin', 'Malay'],
      teaching_levels: ['SPM', 'IGCSE', 'A-Levels'],
      teaching_modes: ['online', 'in_person'],
      online_meeting_link: 'https://meet.google.com/dr-sarah-chen-math',
      physical_address: '123 Jalan Education, Bangsar, 59000 Kuala Lumpur',
      google_maps_link: 'https://maps.google.com/?q=123+Jalan+Education+Bangsar+Kuala+Lumpur',
      waze_link: 'https://waze.com/ul?ll=3.1390,101.6869&navigate=yes'
    },
    {
      id: 2,
      name: 'Mr. Ahmad Rahman',
      email: 'ahmad.rahman@example.com',
      qualification: 'M.Sc. in Physics',
      experience: 6,
      hourly_rate: 70,
      subjects: ['Physics', 'Chemistry'],
      location: 'Petaling Jaya',
      rating: 4.8,
      reviews_count: 93,
      students_count: 38,
      about: 'Experienced science tutor making physics and chemistry fun and understandable. Focus on exam preparation and practical applications.',
      availability: {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: true,
        sunday: true
      },
      languages: ['English', 'Malay'],
      teaching_levels: ['SPM', 'PT3'],
      teaching_modes: ['online', 'in_person'],
      online_meeting_link: 'https://meet.google.com/mr-ahmad-rahman-science',
      physical_address: '456 Science Hub, Petaling Jaya, 46000',
      google_maps_link: 'https://maps.google.com/?q=456+Science+Hub+Petaling+Jaya',
      waze_link: 'https://waze.com/ul?ll=3.1073,101.6067&navigate=yes'
    },
    {
      id: 3,
      name: 'Ms. Emily Watson',
      email: 'emily.watson@example.com',
      qualification: 'B.A. in English Literature',
      experience: 5,
      hourly_rate: 65,
      subjects: ['English', 'Literature'],
      location: 'Subang Jaya',
      rating: 4.7,
      reviews_count: 76,
      students_count: 32,
      about: 'Native English speaker specializing in creative writing, grammar, and literature. Helps students develop strong communication skills.',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true
      },
      languages: ['English'],
      teaching_levels: ['SPM', 'IGCSE', 'Primary'],
      teaching_modes: ['online', 'in_person'],
      online_meeting_link: 'https://meet.google.com/ms-emily-watson-english',
      physical_address: '789 Language Center, Subang Jaya, 47500',
      google_maps_link: 'https://maps.google.com/?q=789+Language+Center+Subang+Jaya',
      waze_link: 'https://waze.com/ul?ll=3.0830,101.5900&navigate=yes'
    },
    {
      id: 4,
      name: 'Mr. David Tan',
      email: 'david.tan@example.com',
      qualification: 'B.Sc. in Computer Science',
      experience: 4,
      hourly_rate: 75,
      subjects: ['Mathematics', 'Computer Science'],
      location: 'Shah Alam',
      rating: 4.6,
      reviews_count: 54,
      students_count: 28,
      about: 'Tech-savvy tutor combining mathematics with programming concepts. Prepares students for modern digital world.',
      availability: {
        monday: false,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false
      },
      languages: ['English', 'Mandarin'],
      teaching_levels: ['SPM', 'IGCSE', 'Programming'],
      teaching_modes: ['online'],
      online_meeting_link: 'https://meet.google.com/mr-david-tan-tech',
      physical_address: null,
      google_maps_link: null,
      waze_link: null
    }
  ]

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Literature', 'Computer Science', 'Additional Mathematics']
  const languages = ['all', 'English', 'Mandarin', 'Malay', 'Tamil', 'Arabic', 'French', 'Spanish', 'Japanese', 'Korean']
  const teachingModes = ['all', 'online', 'in_person', 'both']

  const filteredTutors = mockTutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         tutor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject)
    const matchesLanguage = selectedLanguage === 'all' || tutor.languages.includes(selectedLanguage)

    let matchesMode = selectedMode === 'all'
    if (selectedMode !== 'all') {
      if (selectedMode === 'both') {
        matchesMode = tutor.teaching_modes?.length === 2
      } else {
        matchesMode = tutor.teaching_modes?.includes(selectedMode)
      }
    }

    const matchesPrice = tutor.hourly_rate >= priceRange[0] && tutor.hourly_rate <= priceRange[1]

    return matchesSearch && matchesSubject && matchesLanguage && matchesMode && matchesPrice
  })

  const selectedTutorData = mockTutors.find(t => t.id === selectedTutor)

  return (
    <DashboardLayout userRole="parent">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
          <p className="text-gray-600">Discover qualified tutors for your children</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, subject, language, or location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Type</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {teachingModes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode === 'all' ? 'All Classes' :
                     mode === 'online' ? 'Online Only' :
                     mode === 'in_person' ? 'In-Person Only' : 'Both Types'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (RM)</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (RM)</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tutors List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Tutors ({filteredTutors.length})
              </h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Sort by: Rating</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Experience</option>
              </select>
            </div>

            {filteredTutors.map((tutor) => (
              <div
                key={tutor.id}
                onClick={() => setSelectedTutor(tutor.id)}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTutor === tutor.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.qualification}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">{'★'.repeat(Math.floor(tutor.rating))}</span>
                        <span className="text-gray-400">{'★'.repeat(5 - Math.floor(tutor.rating))}</span>
                        <span className="ml-1 text-sm text-gray-600">{tutor.rating}</span>
                        <span className="ml-2 text-sm text-gray-500">({tutor.reviews_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">RM{tutor.hourly_rate}</p>
                    <p className="text-sm text-gray-500">per hour</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.subjects.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Class Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.teaching_modes?.map((mode, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded flex items-center">
                          {mode === 'online' ? (
                            <>
                              💻 Online
                            </>
                          ) : (
                            <>
                              🏫 In-Person
                            </>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutor.languages.map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{tutor.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>📚 {tutor.experience} years exp</span>
                    <span>👥 {tutor.students_count} students</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tutor Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedTutorData ? (
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutor Details</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedTutorData.name}</h4>
                    <p className="text-sm text-gray-600">{selectedTutorData.qualification}</p>
                    <p className="text-sm text-gray-500">{selectedTutorData.email}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">About</h5>
                    <p className="text-sm text-gray-600">{selectedTutorData.about}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Availability</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedTutorData.availability).map(([day, available]) => (
                        <div key={day} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-1 ${
                            available ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={`capitalize ${available ? 'text-gray-700' : 'text-gray-400'}`}>
                            {day.slice(0, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Languages</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedTutorData.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Class Location</h5>
                    <div className="space-y-2">
                      {selectedTutorData.teaching_modes?.map((mode, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            {mode === 'online' ? (
                              <>
                                <span className="text-lg mr-2">💻</span>
                                <span className="font-medium">Online Classes</span>
                              </>
                            ) : (
                              <>
                                <span className="text-lg mr-2">🏫</span>
                                <span className="font-medium">In-Person Classes</span>
                              </>
                            )}
                          </div>
                          {mode === 'online' && selectedTutorData.online_meeting_link && (
                            <div className="space-y-2">
                              <a
                                href={selectedTutorData.online_meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                🔗 Google Meet Link
                              </a>
                              <p className="text-xs text-gray-600">Click to join online session</p>
                            </div>
                          )}
                          {mode === 'in_person' && selectedTutorData.physical_address && (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-700">{selectedTutorData.physical_address}</p>
                              <div className="flex space-x-2">
                                {selectedTutorData.google_maps_link && (
                                  <a
                                    href={selectedTutorData.google_maps_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    🗺️ Maps
                                  </a>
                                )}
                                {selectedTutorData.waze_link && (
                                  <a
                                    href={selectedTutorData.waze_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    🧭 Waze
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Teaching Levels</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedTutorData.teaching_levels.map((level, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-2">
                      Contact Tutor
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                      Schedule Trial Lesson
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-300 text-6xl mb-4">👨‍🏫</div>
                <p className="text-gray-500">Select a tutor to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}