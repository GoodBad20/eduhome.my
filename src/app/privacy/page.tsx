import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for EduHome.my platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-green-600 to-blue-600">
            <h1 className="text-3xl font-bold text-white text-center">Privacy Policy</h1>
            <p className="mt-2 text-center text-green-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="px-8 py-8 space-y-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Personal Information:</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Full name and contact details</li>
                    <li>Email address and phone number</li>
                    <li>Academic information (for students)</li>
                    <li>Professional qualifications (for tutors)</li>
                    <li>Profile pictures and videos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Usage Data:</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Session logs and interaction data</li>
                    <li>Learning progress and performance</li>
                    <li>Payment history and transactions</li>
                    <li>Communication records</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                <li>Connect students with suitable tutors</li>
                <li>Process payments and manage transactions</li>
                <li>Improve our platform and services</li>
                <li>Provide customer support</li>
                <li>Ensure platform safety and security</li>
                <li>Send relevant notifications and updates</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                <li>Tutors and students for service delivery</li>
                <li>Payment processors for transaction handling</li>
                <li>Service providers supporting our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                <li>SSL encryption for data transmission</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Data backup and recovery systems</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                Under Malaysian Personal Data Protection Act (PDPA), you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request data deletion</li>
                <li>Limit data processing</li>
                <li>Object to data processing</li>
                <li>Request data portability</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">6. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to enhance your experience, analyze site usage, and personalize content. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">7. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your data only as long as necessary for service delivery, legal compliance, or legitimate business purposes. Deleted data is securely erased from our systems.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">8. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are available to users under 18 with parental consent. Parents can review, modify, or delete their child's information by contacting our support team.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">9. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your data is stored and processed within Malaysia. Any international transfers comply with applicable data protection laws.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy periodically. Significant changes will be communicated through email or platform notifications.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">11. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  For privacy-related inquiries, contact our Data Protection Officer at:
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-700"><strong>Email:</strong> privacy@eduhome.my</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +60 123-456-789</p>
                  <p className="text-gray-700"><strong>Address:</strong> Kuala Lumpur, Malaysia</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> This privacy policy complies with Malaysia's Personal Data Protection Act 2010 (PDPA) and should be reviewed by legal counsel before implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}