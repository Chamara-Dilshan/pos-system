// ============================================================================
// Forgot Password Page - CloudPOS
// ============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Store, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { tokens, gradientColors, alertColors, colorScheme } from '../../config/colors';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

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
            Reset Password
          </h1>
          <p className={tokens.text.muted}>
            We'll send you a link to reset your password
          </p>
        </div>

        {/* ── Reset Form ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            // ── Success State ───────────────────────────────────────────────
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className={`text-xl font-semibold ${tokens.text.primary} mb-2`}>
                Check your email
              </h3>
              <p className={`${tokens.text.muted} mb-6`}>
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outlinePrimary"
                  fullWidth
                >
                  Send another link
                </Button>
                <Link to="/login">
                  <Button variant="primary" fullWidth icon={ArrowLeft}>
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // ── Form State ──────────────────────────────────────────────────
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

              {/* Instructions */}
              <div className={`p-4 rounded-xl ${alertColors.info.bg} border ${alertColors.info.border}`}>
                <p className={`text-sm ${alertColors.info.text}`}>
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Email Input */}
              <Input
                label="Email address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={Mail}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Send reset link
              </Button>

              {/* Back to Login */}
              <div className={`text-center pt-4 border-t ${tokens.border.default}`}>
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 text-sm font-semibold ${tokens.text.link}`}
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <p className={`text-center text-xs ${tokens.text.muted} mt-6`}>
          Secure password reset powered by Firebase Authentication
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
