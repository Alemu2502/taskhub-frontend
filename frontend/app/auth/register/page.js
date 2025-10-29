'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone, FiGlobe, FiShield, FiCalendar, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    customCountry: '',
    mobile: '',
    //dateOfBirth: '',
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Check password strength in real-time
  useEffect(() => {
    const password = formData.password;
    
    if (password) {
      setShowPasswordReqs(true);
      setPasswordStrength({
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&#]/.test(password),
      });
    } else {
      setShowPasswordReqs(false);
    }
  }, [formData.password]);

  // Check if all password requirements are met
  const allPasswordRequirementsMet = Object.values(passwordStrength).every(Boolean);

  // Hide password requirements when all are met (after 2 seconds)
  useEffect(() => {
    if (allPasswordRequirementsMet && formData.password) {
      const timer = setTimeout(() => {
        setShowPasswordReqs(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [allPasswordRequirementsMet, formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const validatePassword = () => {
    if (!allPasswordRequirementsMet) {
      toast.error('Password must contain: 8+ characters, uppercase, lowercase, number, and special character');
      setShowPasswordReqs(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      toast.error('You must agree to Terms of Service and Privacy Policy');
      return;
    }

    // Password validation
    if (!validatePassword()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate custom country if "Other" is selected
    if (formData.country === 'Other' && !formData.customCountry.trim()) {
      toast.error('Please enter your country name');
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('register');

      const finalCountry = formData.country === 'Other' ? formData.customCountry : formData.country;

     const response = await authAPI.register({
  fullName: formData.fullName,
  email: formData.email,
  password: formData.password,
  country: finalCountry,
  mobile: formData.mobile,
  recaptchaToken
});

      toast.success(response.data.message || 'Registration successful! Please check your email to verify your account.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            TaskHub
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start earning money by completing simple tasks
          </p>
        </div>

        <div className="card">
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <FiShield className="flex-shrink-0" />
              <span>Duplicate accounts are strictly forbidden and will result in permanent ban.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName">Full Name (must match payout account name)</label>
<input
  type="text"
  name="fullName"
  value={formData.fullName}
  onChange={handleChange}
  className="input-field"
  placeholder="Enter your full legal name"
  minLength={5}
  maxLength={40}
  pattern="[a-zA-Z\s\-'.]+"
  required
/>
            </div>

            <div>
              <label className="label">
                <FiMail className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="label">
                <FiGlobe className="inline mr-2" />
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Country</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Egypt">Egypt</option>
                <option value="Morocco">Morocco</option>
                <option value="Algeria">Algeria</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.country === 'Other' && (
              <div>
                <label className="label">
                  <FiGlobe className="inline mr-2" />
                  Enter Your Country
                </label>
                <input
                  type="text"
                  name="customCountry"
                  value={formData.customCountry}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Type your country name"
                  required
                />
              </div>
            )}

            <div>
              <label className="label">
                <FiPhone className="inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="input-field"
                placeholder="+251 xxx xxx xxx"
                required
              />
            </div>

            <div>
              <label className="label">
                <FiLock className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => formData.password && setShowPasswordReqs(true)}
                  className="input-field pr-10"
                  placeholder="Enter strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              
              {showPasswordReqs && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Password Requirements:
                  </p>
                  <div className="space-y-1.5">
                    <div className={`text-xs flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {passwordStrength.hasMinLength ? <FiCheck /> : <FiX />}
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {passwordStrength.hasUpperCase ? <FiCheck /> : <FiX />}
                      <span>One uppercase letter (A-Z)</span>
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {passwordStrength.hasLowerCase ? <FiCheck /> : <FiX />}
                      <span>One lowercase letter (a-z)</span>
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {passwordStrength.hasNumber ? <FiCheck /> : <FiX />}
                      <span>One number (0-9)</span>
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {passwordStrength.hasSpecialChar ? <FiCheck /> : <FiX />}
                      <span>One special character (@$!%*?&#)</span>
                    </div>
                  </div>
                </div>
              )}

              {allPasswordRequirementsMet && !showPasswordReqs && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <FiCheck />
                  <span>Strong password ✓</span>
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <FiLock className="inline mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <FiX />
                  <span>Passwords do not match</span>
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <FiCheck />
                  <span>Passwords match</span>
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="agreedToTerms"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !allPasswordRequirementsMet}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <div className="text-xs text-center text-gray-500 dark:text-gray-400 -mt-2">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </a>{' '}
              apply.
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
}
