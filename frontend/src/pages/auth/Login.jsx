// ============================================================================
// Login Page - CloudPOS
// ============================================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { tokens, gradientColors, alertColors, colorScheme } from '../../config/colors';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
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
            Welcome Back
          </h1>
          <p className={tokens.text.muted}>
            Sign in to CloudPOS
          </p>
        </div>

        {/* ── Login Form ───────────────────────────────────────────────────── */}
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

            {/* Password Input */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className={`text-sm font-medium ${tokens.text.link}`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign in
            </Button>

            {/* Register Link */}
            <div className={`text-center pt-4 border-t ${tokens.border.default}`}>
              <span className={`text-sm ${tokens.text.muted}`}>Don't have an account? </span>
              <Link to="/register" className={`text-sm font-semibold ${tokens.text.link}`}>
                Create account
              </Link>
            </div>
          </form>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <p className={`text-xs ${tokens.text.muted}`}>
            Secure login powered by Firebase Authentication
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#4285F4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.89 15.673L6.255.461A.542.542 0 017.27.289l2.543 4.771 1.076-1.827a.541.541 0 01.931 0L20.11 15.673H3.89zM20.11 15.673L12.018.289a.541.541 0 00-.931 0l-1.076 1.827-2.543-4.771a.542.542 0 00-1.015.172L3.89 15.673H20.11zM12 17.5L3.89 15.673h16.22L12 17.5zM12 17.5l8.11-1.827H3.89L12 17.5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
