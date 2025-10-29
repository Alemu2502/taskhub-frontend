import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">TaskHub</h3>
            <p className="text-sm">
              Turn your online engagement into earnings. Watch videos, follow accounts, and earn rewards.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition">Home</Link></li>
              <li><Link href="/jobs" className="hover:text-primary-400 transition">Jobs</Link></li>
              <li><Link href="/blogs" className="hover:text-primary-400 transition">Blogs</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-primary-400 transition">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/alemumolla.alemumolla" className="hover:text-primary-400 transition" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="https://twitter.com/ALEXSEPPRO" className="hover:text-primary-400 transition" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/ALEXSEPPRO" className="hover:text-primary-400 transition" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 TaskHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
