import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  Phone
} from 'lucide-react';
import { imageConfig } from '../config/assets';

type LoginTab = 'signin' | 'vip' | 'forgot';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentUser, 
    loginWithEmailOrUsername, 
    loginWithVipPasscode, 
    loginWithGoogle, 
    resetPassword,
    showToast 
  } = useApp();

  // Parse redirect query param if any
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/home';

  // If already logged in, redirect immediately
  useEffect(() => {
    if (currentUser) {
      navigate(redirectUrl, { replace: true });
    }
  }, [currentUser, navigate, redirectUrl]);

  // Tab & Form States
  const [activeTab, setActiveTab] = useState<LoginTab>('signin');

  // Sign-in state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cabai_remember_login') === 'true';
    } catch {
      return false;
    }
  });

  // VIP state
  const [vipPasscode, setVipPasscode] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [showVipPasscode, setShowVipPasscode] = useState(false);

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill remembered identifier on mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem('cabai_remembered_identifier');
      if (savedId) {
        setIdentifier(savedId);
      }
    } catch (e) {}
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your email or username.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Save or clear remembered identifier
    try {
      if (rememberMe) {
        localStorage.setItem('cabai_remembered_identifier', cleanId);
        localStorage.setItem('cabai_remember_login', 'true');
      } else {
        localStorage.removeItem('cabai_remembered_identifier');
        localStorage.removeItem('cabai_remember_login');
      }
    } catch (e) {}

    // Check if VIP passcode entered in password field
    if (cleanPass.toLowerCase() === 'hkylovenbx' || cleanPass.toLowerCase() === 'hkylovegoon') {
      const phoneDigits = cleanId.replace(/\D/g, '');
      if (phoneDigits.length >= 8) {
        setLoading(true);
        const res = await loginWithVipPasscode(cleanPass, cleanId);
        setLoading(false);
        if (res.success) {
          showToast('Welcome back, VIP Maker!', 'success');
          navigate(redirectUrl, { replace: true });
        } else {
          setErrorMessage(res.error || 'VIP sign in failed.');
        }
        return;
      } else {
        setVipPasscode(cleanPass);
        setActiveTab('vip');
        setErrorMessage('VIP passcode detected. Please enter your phone number to sign in.');
        return;
      }
    }

    setLoading(true);
    const res = await loginWithEmailOrUsername(cleanId, cleanPass);
    setLoading(false);

    if (res.success) {
      showToast('Signed in successfully', 'success');
      navigate(redirectUrl, { replace: true });
    } else {
      if (res.notRegistered) {
        setErrorMessage('Account not found with this email or username. Please create an account.');
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email/username and password.');
      }
    }
  };

  const handleVipSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!vipPasscode.trim()) {
      setErrorMessage('Please enter your VIP access passcode.');
      return;
    }
    const cleanPhone = vipPhone.trim();
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || phoneDigits.length < 8) {
      setErrorMessage('Please enter a valid phone number (minimum 8 digits) for VIP sign in.');
      return;
    }

    setLoading(true);
    const res = await loginWithVipPasscode(vipPasscode, cleanPhone);
    setLoading(false);

    if (res.success) {
      showToast('Welcome back, VIP Maker!', 'success');
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage(res.error || 'Incorrect VIP passcode.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await loginWithGoogle();
    setLoading(false);

    if (res.success) {
      showToast('Signed in with Google', 'success');
      navigate(redirectUrl, { replace: true });
    } else if (res.code === 'popup_blocked') {
      const gEmail = window.prompt('Browser popup was blocked by sandbox. Enter your Google email to sign in:');
      if (gEmail && gEmail.includes('@')) {
        setLoading(true);
        const retryRes = await loginWithGoogle(gEmail.trim());
        setLoading(false);
        if (retryRes.success) {
          showToast('Signed in with Google', 'success');
          navigate(redirectUrl, { replace: true });
          return;
        }
      }
      setErrorMessage('Google popup was blocked. You can also sign in with Email or VIP passcode.');
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccess('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your email or username.');
      return;
    }
    if (!forgotNewPassword.trim() || forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(forgotIdentifier.trim(), forgotNewPassword.trim());
    setLoading(false);

    if (res.success) {
      setForgotSuccess('Password reset successfully. You can now sign in.');
      setIdentifier(forgotIdentifier.trim());
      setTimeout(() => {
        setActiveTab('signin');
        setForgotSuccess('');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. User not found.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-red-700 selection:text-white">
      {/* Top Navigation */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cabai</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 p-1.5 mx-auto mb-4 flex items-center justify-center shadow-md">
            <img
              src={imageConfig.logos.header}
              alt="Cabai"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = imageConfig.logos.favicon;
              }}
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {activeTab === 'vip' 
              ? 'VIP Passcode Access' 
              : activeTab === 'forgot' 
                ? 'Reset Your Password' 
                : 'Sign in to your account'}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {activeTab === 'vip'
              ? 'Enter your VIP passcode to unlock special benefits'
              : activeTab === 'forgot'
                ? 'Provide your account email or username'
                : 'Welcome back. Enter your credentials to continue.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Subtle Tab Switcher */}
          {activeTab !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-xl mb-6 border border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'signin'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Standard Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('vip');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'vip'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>VIP Passcode</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-900/60 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Message */}
          {forgotSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-900/60 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{forgotSuccess}</div>
            </div>
          )}

          {/* Standard Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or username"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 border border-zinc-800 text-sm transition"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(identifier);
                      setActiveTab('forgot');
                      setErrorMessage('');
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-medium transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 border border-zinc-800 text-sm transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-medium rounded-xl transition shadow-md flex items-center justify-center text-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white text-sm font-medium transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* VIP Passcode Form */}
          {activeTab === 'vip' && (
            <form onSubmit={handleVipSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  VIP Passcode
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showVipPasscode ? 'text' : 'password'}
                    value={vipPasscode}
                    onChange={(e) => setVipPasscode(e.target.value)}
                    placeholder="Enter your VIP passcode"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-zinc-800 text-sm transition"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowVipPasscode(!showVipPasscode)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 transition"
                    title={showVipPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showVipPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-zinc-800 text-sm transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-medium rounded-xl transition shadow-md flex items-center justify-center text-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In with VIP Pass'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  &larr; Back to standard login
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter registered email or username"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 border border-zinc-800 text-sm transition"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showForgotNewPass ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 border border-zinc-800 text-sm transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 transition"
                  >
                    {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showForgotConfirmPass ? 'text' : 'password'}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-zinc-950 rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 border border-zinc-800 text-sm transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 transition"
                  >
                    {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-medium rounded-xl transition shadow-md flex items-center justify-center text-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Update Password'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  &larr; Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* Bottom Footer */}
          <div className="mt-6 pt-5 border-t border-zinc-800 text-center text-xs text-zinc-400">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/register"
              className="text-red-400 hover:text-red-300 font-medium transition ml-1"
            >
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
