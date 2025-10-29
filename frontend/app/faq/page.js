import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const faqs = [
  {
    question: 'How do I start earning?',
    answer: 'Register with your full name, email, and mobile number. After verifying your email, you can start applying for jobs such as watching videos, following social accounts, or other online tasks.',
  },
  {
    question: 'How and when can I withdraw?',
    answer: 'Once your balance reaches $1, you can request a withdrawal via TeleBirr, CBE (Commercial Bank of Ethiopia), or BEP20 (crypto). Follow the instructions in the withdrawal section to request payout.',
  },
  {
    question: 'Are there any requirements for using TeleBirr or CBE?',
    answer: 'Yes. For TeleBirr or CBE withdrawals, the name registered on your TaskHub account must match EXACTLY with the name on your TeleBirr or CBE account. This is required for successful payment processing. BEP20 withdrawals can be made to any valid BEP20 wallet you own.',
  },
  {
    question: 'What proof do I need to submit?',
    answer: 'Most jobs require a screenshot or similar image to show that you completed the required action. Clear proof helps the admin approve your work faster.',
  },
  {
    question: 'What happens after submitting a job application?',
    answer: 'Your application will be reviewed by an admin. Upon approval, your earnings are instantly credited to your wallet. If rejected, your balance does not change and you can review feedback.',
  },
  {
    question: 'Can I create my own jobs?',
    answer: 'Currently, only admins can create jobs. As a user, you can apply for available jobs and withdraw your earnings when eligible.',
  },
  {
    question: 'Is TaskHub free to join? Is there any age limit?',
    answer: 'Yes, TaskHub is completely free and open to everyone. There is no age restriction to join.',
  },
  {
    question: 'How secure is my account and information?',
    answer: 'Your account uses secure authentication. We protect your full name, email, mobile, and payment information. Your data is never sold or shared outside TaskHub.',
  },
  {
    question: 'Can I make multiple accounts?',
    answer: 'No. Each person may register only once with a real full name and unique mobile number. Any duplicate or fake registrations will be banned and deleted.',
  },
];

export default function FAQ() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get answers to common questions about earning, withdrawing, and using TaskHub.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card">
                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
