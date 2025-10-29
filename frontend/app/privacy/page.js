import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="card prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information you provide directly to us when you create an account and use TaskHub.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Personal Information:</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile phone number</li>
              <li>Country of residence</li>
              <li>Payment/withdrawal account details (BEP20 wallet, TeleBirr, CBE)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Automatically Collected Information:</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and activity logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>To create and manage your account</li>
              <li>To process job applications and payments</li>
              <li>To prevent fraud and detect duplicate accounts</li>
              <li>To communicate important updates</li>
              <li>To improve our services</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Fraud Prevention & Duplicate Account Detection</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To maintain platform integrity and prevent abuse, we use advanced detection systems including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>IP Address Tracking:</strong> We monitor IP addresses to identify suspicious patterns</li>
              <li><strong>Device Fingerprinting:</strong> We collect device information to detect multiple accounts from the same device</li>
              <li><strong>Email, Mobile & Payment Verification:</strong> We verify contact and payout details to prevent fake or duplicate accounts</li>
              <li><strong>Behavioral Analysis:</strong> We analyze user behavior patterns to identify fraudulent activity</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong className="text-red-600 dark:text-red-400">Creating duplicate accounts will result in permanent ban of all associated accounts.</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Payment Processors:</strong> To process withdrawals (BEP20, TeleBirr, CBE Bank)</li>
              <li><strong>Service Providers:</strong> Who assist in platform operations</li>
              <li><strong>Law Enforcement:</strong> When required by law or to prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Encryption of sensitive data (passwords, payment details)</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Limited employee access to user data</li>
              <li>Google reCAPTCHA to prevent bot attacks</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Request account deletion (subject to pending transactions)</li>
              <li>Opt out of promotional communications</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Detect duplicate accounts</li>
              <li>Analyze platform usage</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We retain your information for as long as your account is active or as needed to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Prevent fraud (up to 5 years after account closure)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">9. Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We integrate with third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Google reCAPTCHA:</strong> For bot prevention (subject to Google's Privacy Policy)</li>
              <li><strong>Payment Providers:</strong> For withdrawals (BEP20 wallets, TeleBirr, CBE Bank)</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this policy from time to time. We will notify you of significant changes via email or platform notification.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For privacy-related questions or to exercise your rights, contact us through the Contact page.
            </p>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and maintaining transparency about our data practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
