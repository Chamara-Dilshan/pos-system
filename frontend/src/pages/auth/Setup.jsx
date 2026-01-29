// ============================================================================
// Setup Page - CloudPOS First-Time Setup Wizard
// ============================================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { tokens, gradientColors, alertColors, colorScheme } from '../../config/colors';
import api from '../../services/api';

const Setup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSetup, setCheckingSetup] = useState(true);

  const { setupAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const status = await api.checkSetupStatus();
        if (status.setupComplete) {
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to check setup status:', err);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetupStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await setupAdmin(email, password, name);
      navigate('/pos');
    } catch (err) {
      setError(err.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${gradientColors.subtlePrimary}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg animate-pulse"
            style={{ backgroundColor: colorScheme.primary[600] }}>
            <Store size={32} className="text-white" />
          </div>
          <p className={tokens.text.muted}>Checking setup status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${gradientColors.subtlePrimary} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full">
        {/* ── Logo & Title ─────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ backgroundColor: colorScheme.primary[600] }}
          >
            <Store size={32} className="text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${tokens.text.primary} mb-2`}>
            Welcome to CloudPOS
          </h1>
          <p className={tokens.text.muted}>
            First-time setup - Create your administrator account
          </p>
        </div>

        {/* ── Setup Form ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-800">
                This account will have full administrative access to CloudPOS.
              </p>
            </div>

            {/* Name Input */}
            <Input
              label="Full name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              icon={User}
              required
            />

            {/* Email Input */}
            <Input
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              icon={Mail}
              required
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Complete Setup
            </Button>
          </form>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <p className={`text-xs ${tokens.text.muted}`}>
            Secure setup powered by Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;
