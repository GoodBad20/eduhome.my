import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for EduHome.my platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-3xl font-bold text-white text-center">Terms of Service</h1>
            <p className="mt-2 text-center text-blue-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="px-8 py-8 space-y-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using EduHome.my, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                EduHome.my is an educational platform connecting students with qualified tutors in Malaysia. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                <li>Home tuition matching services</li>
                <li>Online tutoring sessions</li>
                <li>Educational resource sharing</li>
                <li>Progress tracking and reporting</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3. User Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">For Students and Parents:</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Provide accurate information during registration</li>
                    <li>Make timely payments for services rendered</li>
                    <li>Treat tutors with respect and professionalism</li>
                    <li>Provide a safe learning environment</li>
                    <li>Give at least 24 hours notice for cancellations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">For Tutors:</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Maintain professional qualifications</li>
                    <li>Provide quality educational services</li>
                    <li>Adhere to scheduled session times</li>
                    <li>Maintain student confidentiality</li>
                    <li>Report any safety concerns immediately</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                All payments are processed through secure third-party payment providers. Tutors receive payments after successful completion of sessions. Refunds are subject to our cancellation policy.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">5. Privacy and Data Protection</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">6. Prohibited Activities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Sharing login credentials with others</li>
                <li>Using the platform for illegal activities</li>
                <li>Harassment or discrimination of any kind</li>
                <li>Unauthorized commercial use of the platform</li>
                <li>Attempting to compromise system security</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">7. Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms. Users may terminate their accounts at any time through their account settings.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">8. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                EduHome.my acts as a connecting platform and is not responsible for the quality of tutoring services provided. We encourage users to conduct their own due diligence.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">9. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-700"><strong>Email:</strong> support@eduhome.my</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +60 123-456-789</p>
                  <p className="text-gray-700"><strong>Address:</strong> Kuala Lumpur, Malaysia</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> These terms of service are a template and should be reviewed by legal counsel before implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}