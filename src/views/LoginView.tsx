import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Auth3DCanvas } from '../components/Auth3DCanvas';
import { Auth3DCard } from '../components/Auth3DCard';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  LogIn, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  Box,
  UserPlus
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

  const [activeTab, setActiveTab] = useState<LoginTab>('signin');
  
  // Sign-in state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // VIP state
  const [vipPasscode, setVipPasscode] = useState('');
  const [vipPhone, setVipPhone] = useState('');

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your registered email or username.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Check if VIP passcode entered in password field
    if (cleanPass.toLowerCase() === 'hkylovenbx' || cleanPass.toLowerCase() === 'hkylovegoon') {
      const phoneDigits = cleanId.replace(/\D/g, '');
      if (phoneDigits.length >= 8) {
        setLoading(true);
        const res = await loginWithVipPasscode(cleanPass, cleanId);
        setLoading(false);
        if (res.success) {
          showToast('Welcome back, VIP Maker! 👑', 'success');
          navigate(redirectUrl, { replace: true });
        } else {
          setErrorMessage(res.error || 'VIP sign in failed.');
        }
        return;
      } else {
        setVipPasscode(cleanPass);
        setActiveTab('vip');
        setInfoMessage('VIP passcode detected! Please enter your phone number to sign in.');
        return;
      }
    }

    setLoading(true);
    const res = await loginWithEmailOrUsername(cleanId, cleanPass);
    setLoading(false);

    if (res.success) {
      showToast('Signed in successfully! 🚀', 'success');
      navigate(redirectUrl, { replace: true });
    } else {
      if (res.notRegistered) {
        setErrorMessage('Account not found with this email or username. Please create an account.');
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
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
      showToast('Welcome back, VIP Maker! 👑', 'success');
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
      showToast('Signed in with Google! ✨', 'success');
      navigate(redirectUrl, { replace: true });
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccess('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your registered email or username.');
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
      setForgotSuccess('Password reset successfully! You can now sign in.');
      setIdentifier(forgotIdentifier.trim());
      setTimeout(() => {
        setActiveTab('signin');
        setForgotSuccess('');
      }, 1800);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. User not found.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#09090B] selection:bg-[#AF101A] p-3 sm:p-6 font-sans text-white flex flex-col items-center justify-center overflow-x-hidden">
      
      {/* 3D Interactive WebGL Background */}
      <Auth3DCanvas className="opacity-60" />

      {/* Top Navigation Bar: Back to Landing */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] text-white text-xs font-mono-code font-bold backdrop-blur-md transition-all border border-white/10 shadow-xl active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cabai</span>
        </Link>
      </div>

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md my-auto py-8">
        <Auth3DCard maxTilt={6} glowColor="rgba(175, 16, 26, 0.4)">
          <div className="bg-[#111113]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-black border-2 border-red-500/40 p-1.5 mx-auto shadow-xl flex items-center justify-center">
                <img
                  src={imageConfig.logos.header}
                  alt="Cabai Enterprise"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = imageConfig.logos.favicon;
                  }}
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-800/80 text-[#FF4D5A] text-[10px] font-mono-code font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D MAKER AUTHENTICATION</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {activeTab === 'vip' ? 'VIP Passcode Hub' : activeTab === 'forgot' ? 'Reset Password' : 'Sign In to Cabai'}
              </h1>
              
              <p className="text-xs text-white/60">
                {redirectUrl !== '/home' 
                  ? 'Sign in to continue to your requested destination.' 
                  : 'Access your 3D custom studio, order history & slicing quotes.'}
              </p>
            </div>

            {/* Notification messages */}
            {infoMessage && (
              <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs flex items-start gap-2 font-mono-code">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-start gap-2 font-mono-code">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2 font-mono-code">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. SIGN IN TAB */}
            {/* ========================================================= */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 text-left">
                
                {/* Identifier */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Email or Username <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. maker@example.com or username"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border border-white/10 text-xs font-mono-code transition-all"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono-code font-bold text-white/80">
                      Password <span className="text-[#FF4D5A]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(identifier);
                        setActiveTab('forgot');
                        setErrorMessage('');
                      }}
                      className="text-[11px] font-mono-code text-[#FF4D5A] hover:text-white font-bold hover:underline transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border border-white/10 text-xs font-mono-code transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.98] text-white font-mono-code font-bold rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In &amp; Enter Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Google Sign-in Alternative */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full h-11 bg-[#18181B] hover:bg-[#27272A] border border-white/10 rounded-xl text-white text-xs font-mono-code font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* VIP Passcode Link */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('vip'); setErrorMessage(''); }}
                    className="text-xs font-mono-code text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Have a VIP Passcode? Sign in here</span>
                  </button>
                </div>

              </form>
            )}

            {/* ========================================================= */}
            {/* 2. VIP PASSCODE TAB */}
            {/* ========================================================= */}
            {activeTab === 'vip' && (
              <form onSubmit={handleVipSignIn} className="space-y-4 text-left">
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 font-mono-code">
                  Enter your VIP studio passcode to unlock exclusive maker discounts &amp; priority print queue.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    VIP Passcode <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={vipPasscode}
                    onChange={(e) => setVipPasscode(e.target.value)}
                    placeholder="Enter VIP passcode"
                    className="w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 border border-amber-500/30 text-xs font-mono-code transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Your Phone Number (Malaysia) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 border border-white/10 text-xs font-mono-code transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 active:scale-[0.98] text-white font-mono-code font-bold rounded-xl shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-amber-300" />
                      <span>Authenticate VIP Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                    className="text-xs font-mono-code text-white/60 hover:text-white"
                  >
                    &larr; Back to standard login
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* 3. FORGOT PASSWORD TAB */}
            {/* ========================================================= */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-left">
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 font-mono-code flex items-start gap-2">
                  <Key className="w-4 h-4 text-[#FF4D5A] shrink-0 mt-0.5" />
                  <span>Enter your registered email or username and choose a new password.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Email or Username <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. you@example.com or username"
                    className="w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    New Password <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Confirm New Password <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <input
                    type="password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#AF101A] hover:bg-[#E11D48] text-white font-mono-code font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Update New Password</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                    className="text-xs font-mono-code text-white/60 hover:text-white"
                  >
                    &larr; Back to sign in
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Register CTA */}
            <div className="pt-4 border-t border-white/10 text-center font-mono-code text-xs text-white/60">
              Don&apos;t have an account yet?{' '}
              <Link
                to="/register"
                className="text-[#FF4D5A] hover:text-white font-bold hover:underline transition-colors ml-1"
              >
                Create Account &rarr;
              </Link>
            </div>

          </div>
        </Auth3DCard>
      </div>

    </div>
  );
};
