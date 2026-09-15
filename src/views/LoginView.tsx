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
  X,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Phone,
  HelpCircle
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

  // Tab & Control States
  const [activeTab, setActiveTab] = useState<LoginTab>('signin');
  const [enable3D, setEnable3D] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cabai_auth_3d_enabled') !== 'false';
    } catch {
      return true;
    }
  });
  const [showQuickControls, setShowQuickControls] = useState<boolean>(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

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
  const [infoMessage, setInfoMessage] = useState('');

  // Auto-fill remembered identifier on mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem('cabai_remembered_identifier');
      if (savedId) {
        setIdentifier(savedId);
      }
    } catch (e) {}
  }, []);

  // Keyboard shortcut listener: ESC to clear error/info
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setErrorMessage('');
        setInfoMessage('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Monitor CapsLock state
  const handleKeyModifierCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  // Toggle 3D motion preference
  const toggle3DMotion = () => {
    const nextVal = !enable3D;
    setEnable3D(nextVal);
    try {
      localStorage.setItem('cabai_auth_3d_enabled', nextVal ? 'true' : 'false');
    } catch (e) {}
  };

  // One-click quick fill controls
  const handleQuickFillVip = () => {
    setActiveTab('vip');
    setVipPasscode('hkylovegoon');
    setVipPhone('0123456789');
    setErrorMessage('');
    setInfoMessage('VIP credentials populated! Click "Authenticate VIP Pass" or use 1-Click VIP.');
    showToast('VIP credentials filled! 👑', 'info');
  };

  const handleQuickFillDemoUser = () => {
    setActiveTab('signin');
    setIdentifier('maker@cabai.com');
    setPassword('MakerPass123!');
    setErrorMessage('');
    setInfoMessage('Demo credentials filled (maker@cabai.com / MakerPass123!). Click "Sign In" below.');
    showToast('Demo credentials filled! 🌶️', 'info');
  };

  const handleInstantDemoLogin = async () => {
    setActiveTab('signin');
    setIdentifier('maker@cabai.com');
    setPassword('MakerPass123!');
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);
    const res = await loginWithEmailOrUsername('maker@cabai.com', 'MakerPass123!');
    setLoading(false);
    if (res.success) {
      showToast('Welcome to Cabai Maker Studio! 🚀', 'success');
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage(res.error || 'Failed to sign in demo user.');
    }
  };

  const handleInstantVipLogin = async () => {
    setActiveTab('vip');
    setVipPasscode('hkylovegoon');
    setVipPhone('0123456789');
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);
    const res = await loginWithVipPasscode('hkylovegoon', '0123456789');
    setLoading(false);
    if (res.success) {
      showToast('Welcome back, VIP Maker! 👑', 'success');
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage(res.error || 'VIP sign in failed.');
    }
  };

  const handleClearCurrentForm = () => {
    if (activeTab === 'signin') {
      setIdentifier('');
      setPassword('');
    } else if (activeTab === 'vip') {
      setVipPasscode('');
      setVipPhone('');
    } else if (activeTab === 'forgot') {
      setForgotIdentifier('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    }
    setErrorMessage('');
    setInfoMessage('');
  };

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
    setInfoMessage('');
    const res = await loginWithGoogle();
    setLoading(false);

    if (res.success) {
      showToast('Signed in with Google! ✨', 'success');
      navigate(redirectUrl, { replace: true });
    } else if (res.code === 'popup_blocked') {
      const gEmail = window.prompt('Browser popup was blocked by sandbox. Enter your Google email to sign in:');
      if (gEmail && gEmail.includes('@')) {
        setLoading(true);
        const retryRes = await loginWithGoogle(gEmail.trim());
        setLoading(false);
        if (retryRes.success) {
          showToast('Signed in with Google! ✨', 'success');
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
      
      {/* 3D Interactive WebGL Background (Controllable) */}
      {enable3D && <Auth3DCanvas className="opacity-60" />}

      {/* Top Header Controls Bar */}
      <div className="fixed top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: Back to Landing */}
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] text-white text-xs font-mono-code font-bold backdrop-blur-md transition-all border border-white/10 shadow-xl active:scale-95"
          title="Back to Cabai Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cabai</span>
        </Link>

        {/* Right: Quick Controls & 3D Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* 3D Motion Toggle */}
          <button
            type="button"
            onClick={toggle3DMotion}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono-code font-bold transition-all border backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 ${
              enable3D
                ? 'bg-[#18181B]/90 hover:bg-[#27272A] text-white border-white/10'
                : 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-amber-500/40'
            }`}
            title={enable3D ? 'Disable 3D Background & Tilt (For slower devices or high focus)' : 'Enable 3D Background & Tilt'}
          >
            <SlidersHorizontal className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">3D Motion:</span>
            <span>{enable3D ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md my-auto py-8">
        <Auth3DCard maxTilt={enable3D ? 6 : 0} glowColor="rgba(175, 16, 26, 0.4)">
          <div className="bg-[#111113]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-black border-2 border-red-500/40 p-1 mx-auto shadow-xl flex items-center justify-center">
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
                <span>CABAI AUTHENTICATION</span>
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

            {/* ========================================================= */}
            {/* TOP CONTROLLER: EASY SEGMENTED TAB SWITCHER */}
            {/* ========================================================= */}
            <div className="p-1 bg-[#18181B] rounded-2xl border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-[#AF101A] text-white shadow-md shadow-red-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title="Account Sign In"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('vip');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  activeTab === 'vip'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title="VIP Access Pass"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>VIP Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  if (identifier && !forgotIdentifier) setForgotIdentifier(identifier);
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  activeTab === 'forgot'
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title="Reset Password"
              >
                <Key className="w-3.5 h-3.5 shrink-0" />
                <span>Reset</span>
              </button>
            </div>

            {/* ========================================================= */}
            {/* QUICK CONTROLS / SHORTCUTS ACCORDION */}
            {/* ========================================================= */}
            <div className="bg-[#18181B]/80 rounded-2xl border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowQuickControls(!showQuickControls)}
                className="w-full px-3.5 py-2 flex items-center justify-between text-[11px] font-mono-code font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Control Shortcuts</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <span>{showQuickControls ? 'Hide' : 'Show'}</span>
                  {showQuickControls ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              </button>

              {showQuickControls && (
                <div className="px-3.5 pb-2.5 pt-1.5 border-t border-white/5 space-y-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={handleQuickFillVip}
                      className="px-2 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono-code font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-center"
                      title="Pre-fill VIP passcode and phone number"
                    >
                      <Crown className="w-3 h-3 shrink-0 text-amber-400" />
                      <span className="truncate">Fill VIP</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickFillDemoUser}
                      className="px-2 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-[10px] font-mono-code font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-center"
                      title="Pre-fill demo user credentials"
                    >
                      <User className="w-3 h-3 shrink-0 text-[#FF4D5A]" />
                      <span className="truncate">Fill Demo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearCurrentForm}
                      className="px-2 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 text-[10px] font-mono-code font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-center"
                      title="Clear current form fields"
                    >
                      <RotateCcw className="w-3 h-3 shrink-0 text-zinc-400" />
                      <span className="truncate">Clear Fields</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={handleInstantDemoLogin}
                      disabled={loading}
                      className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-red-900/70 to-rose-900/70 hover:from-red-800 hover:to-rose-800 border border-red-500/40 text-red-100 text-[10px] font-mono-code font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-center shadow-sm disabled:opacity-50"
                      title="Instantly sign in with Maker Demo Account"
                    >
                      <Zap className="w-3 h-3 shrink-0 text-amber-400" />
                      <span className="truncate">⚡ Fast Demo Enter</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleInstantVipLogin}
                      disabled={loading}
                      className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/70 to-yellow-950/70 hover:from-amber-900 hover:to-yellow-900 border border-amber-500/40 text-amber-200 text-[10px] font-mono-code font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-center shadow-sm disabled:opacity-50"
                      title="Instantly authenticate with VIP Passcode"
                    >
                      <Crown className="w-3 h-3 shrink-0 text-amber-400" />
                      <span className="truncate">👑 1-Click VIP Enter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification messages with dismiss button */}
            {infoMessage && (
              <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs flex items-start justify-between gap-2 font-mono-code animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                  <span>{infoMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInfoMessage('')}
                  className="text-blue-400 hover:text-white p-0.5 cursor-pointer shrink-0"
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-start justify-between gap-2 font-mono-code animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-red-400 hover:text-white p-0.5 cursor-pointer shrink-0"
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs flex items-start justify-between gap-2 font-mono-code animate-in fade-in">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{forgotSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotSuccess('')}
                  className="text-emerald-400 hover:text-white p-0.5 cursor-pointer shrink-0"
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Caps Lock Alert Banner */}
            {isCapsLockOn && (
              <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-600/60 text-amber-300 text-[11px] font-mono-code flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Notice: Caps Lock is ON</span>
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
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="e.g. maker@example.com or username"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border border-white/10 text-xs font-mono-code transition-all"
                      required
                      autoFocus
                    />
                    {identifier && (
                      <button
                        type="button"
                        onClick={() => setIdentifier('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                        title="Clear field"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
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
                      className="text-[11px] font-mono-code text-[#FF4D5A] hover:text-white font-bold hover:underline transition-colors cursor-pointer"
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
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="Enter your password"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border border-white/10 text-xs font-mono-code transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Quick Helpers */}
                <div className="flex items-center justify-between text-xs font-mono-code text-white/70 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#18181B] border-white/20 text-[#AF101A] focus:ring-[#AF101A] cursor-pointer"
                    />
                    <span className="text-[11px]">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('vip'); setErrorMessage(''); }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-3 h-3" />
                    <span>Use VIP Passcode</span>
                  </button>
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
                <div className="pt-1">
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
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono-code font-bold text-white/80">
                      VIP Passcode <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono-code">Default: hkylovegoon</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showVipPasscode ? 'text' : 'password'}
                      value={vipPasscode}
                      onChange={(e) => setVipPasscode(e.target.value)}
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="Enter VIP passcode"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-20 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 border border-amber-500/30 text-xs font-mono-code transition-all"
                      required
                      autoFocus
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {vipPasscode && (
                        <button
                          type="button"
                          onClick={() => setVipPasscode('')}
                          className="text-white/40 hover:text-white p-1 cursor-pointer"
                          title="Clear field"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowVipPasscode(!showVipPasscode)}
                        className="text-white/40 hover:text-white p-1 cursor-pointer"
                        title={showVipPasscode ? 'Hide passcode' : 'Show passcode'}
                      >
                        {showVipPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Your Phone Number (Malaysia) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={vipPhone}
                      onChange={(e) => setVipPhone(e.target.value)}
                      placeholder="e.g. 0123456789"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 border border-white/10 text-xs font-mono-code transition-all"
                      required
                    />
                    {vipPhone && (
                      <button
                        type="button"
                        onClick={() => setVipPhone('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                        title="Clear phone"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                    className="text-xs font-mono-code text-white/60 hover:text-white transition-colors cursor-pointer"
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

                {/* Reset Identifier */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Email or Username <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. you@example.com or username"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                      required
                      autoFocus
                    />
                    {forgotIdentifier && (
                      <button
                        type="button"
                        onClick={() => setForgotIdentifier('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                        title="Clear field"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* New Password with Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    New Password <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showForgotNewPass ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                      title={showForgotNewPass ? 'Hide password' : 'Show password'}
                    >
                      {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password with Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code font-bold text-white/80">
                    Confirm New Password <span className="text-[#FF4D5A]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showForgotConfirmPass ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="Re-enter new password"
                      className="w-full bg-[#18181B] rounded-xl h-11 pl-10 pr-10 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] border border-white/10 text-xs font-mono-code"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 cursor-pointer"
                      title={showForgotConfirmPass ? 'Hide password' : 'Show password'}
                    >
                      {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                    className="text-xs font-mono-code text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    &larr; Back to sign in
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Register & Help Links */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-center font-mono-code text-xs">
              <div className="text-white/60">
                Don&apos;t have an account yet?{' '}
                <Link
                  to="/register"
                  className="text-[#FF4D5A] hover:text-white font-bold hover:underline transition-colors ml-1"
                >
                  Create Account &rarr;
                </Link>
              </div>

              <div className="text-[11px] text-white/40">
                Need assistance?{' '}
                <a
                  href="https://wa.me/60123456789?text=Hi%20Cabai%20Team,%20I%20need%20help%20with%20my%20login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#FF4D5A] hover:underline"
                >
                  WhatsApp Studio Support
                </a>
              </div>
            </div>

          </div>
        </Auth3DCard>
      </div>

    </div>
  );
};
