import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import { FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">UseTaskHub</h3>
            <p className="text-sm">
              Turn your online engagement into earnings. Watch videos, follow accounts, and earn rewards.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/jobs" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Jobs</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Blogs</a>
                </Link>
              </li>
              <li>
                <Link href="/faq" legacyBehavior>
                  <a className="hover:text-primary-400 transition">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/terms" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy" legacyBehavior>
                  <a className="hover:text-primary-400 transition">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://discord.gg/gnA2xwEUjW" className="hover:text-primary-400 transition" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={20} />
              </a>
              <a href="https://twitter.com/taskhub_officia" className="hover:text-primary-400 transition" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <FiTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/taskhub_official1" className="hover:text-primary-400 transition" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 UseTaskHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
