import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          
          <div className="card prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using TaskHub, you accept and agree to be bound by these Terms of Service. 
              If you do not agree, please do not use our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Account Registration</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You must provide your real full name, email, and mobile number during registration. 
              <strong className="text-red-600 dark:text-red-400"> Creating duplicate accounts with differing payment or identity information is strictly prohibited and will result in account suspension and loss of funds.</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Only one account per person is allowed</li>
              <li>Your payment/withdrawal method (TeleBirr or CBE) must match your real registered name</li>
              <li>You are responsible for maintaining account security</li>
              <li>Fraudulent activity will result in an immediate ban</li>
              <li>We track device, IP, and mobile for duplicate prevention</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Earning and Payments</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Users earn money by completing admin-posted tasks. Earnings are credited following admin approval.
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Minimum withdrawal: $1.00 USD (or local equivalent)</li>
              <li>Supported: BEP20 (crypto), TeleBirr, CBE Bank</li>
              <li>Withdrawals are only processed if payment name/account matches registration name for bank/mobile</li>
              <li>TaskHub reserves the right to reject or reverse suspicious withdrawals</li>
              <li>Incorrect account details or wallet addresses are the user's responsibility</li>
              <li>Payouts are typically processed within 24 hours after your request</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Prohibited Activities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">These activities are forbidden and may result in permanent ban:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Creating more than one account per person</li>
              <li>Using bots, scripts, or automation tools</li>
              <li>Providing false or fraudulent proof</li>
              <li>Sharing your account or withdrawal credentials</li>
              <li>Attempting to manipulate, hack, or exploit the system</li>
              <li>Harassing admins or other users</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Account Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TaskHub may suspend or terminate any account at any time for violating these terms. 
              On termination, any pending earnings will be forfeited.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Only apply for jobs you can truly complete</li>
              <li>Submit valid proof for all job applications</li>
              <li>Use correct and matching withdrawal/payout details</li>
              <li>Keep your account details secure</li>
              <li>Report bugs or suspicious activity to admins</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TaskHub is provided "as is" without warranty. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Loss of earnings caused by downtime or bugs</li>
              <li>Payment delays by third-party processors</li>
              <li>Payout failures due to user account errors</li>
              <li>Account access problems due to lost credentials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These terms may change at any time. Continued use means you accept new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">9. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For questions or concerns, contact us via the Contact page.
            </p>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                <strong>Important:</strong> By using TaskHub, you agree to these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
