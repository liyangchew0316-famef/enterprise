import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Auth3DCanvas } from './Auth3DCanvas';
import { Auth3DCard } from './Auth3DCard';
import { 
  X, 
  Lock, 
  Crown, 
  LogOut, 
  ShoppingBag, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  User, 
  Mail, 
  RefreshCw, 
  UserPlus, 
  LogIn, 
  Key, 
  Phone,
  Box,
  Zap
} from 'lucide-react';
import { imageConfig } from '../config/assets';

type AuthTab = 'signin' | 'register' | 'forgot' | 'vip' | 'google';

export const AuthModal: React.FC = () => {
  const { 
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isInitialLoginGateOpen,
    loginWithEmailOrUsername,
    signUpWithCredentials,
    resetPassword,
    updateProfilePassword,
    loginWithVipPasscode,
    loginWithGoogle,
    logout,
    orders,
    setCurrentView
  } = useApp();

  const isOpen = isInitialLoginGateOpen || isAuthModalOpen;

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  
  // Sign-In Form State
  const [signinIdentifier, setSigninIdentifier] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password Form State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  // Profile Password Reset Form State (for logged-in user)
  const [showProfileResetSection, setShowProfileResetSection] = useState(false);
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [profileResetSuccess, setProfileResetSuccess] = useState('');
  const [profileResetError, setProfileResetError] = useState('');
  const [profileResetLoading, setProfileResetLoading] = useState(false);

  // VIP Login Form State
  const [vipPasscode, setVipPasscode] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [showVipPassword, setShowVipPassword] = useState(false);

  // Status & Notifications
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    // Only allow closing if already logged in
    if (currentUser) {
      setIsAuthModalOpen(false);
      setErrorMessage('');
      setInfoMessage('');
    }
  };

  // 1. Sign-In Submit Handler
  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const cleanId = signinIdentifier.trim();
    const cleanPass = signinPassword.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your email, username, or phone number.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Check if user entered VIP passcode into sign in
    if (cleanPass.toLowerCase() === 'hkylovenbx' || cleanPass.toLowerCase() === 'hkylovegoon') {
      const phoneDigits = cleanId.replace(/\D/g, '');
      if (phoneDigits.length >= 8) {
        setLoading(true);
        const res = await loginWithVipPasscode(cleanPass, cleanId);
        setLoading(false);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in as VIP.');
        }
        return;
      } else {
        // Switch directly to VIP tab with passcode and instructions
        setVipPasscode(cleanPass);
        setVipPhone('');
        setActiveTab('vip');
        setInfoMessage('VIP passcode recognized! Please enter your phone number to sign in as VIP.');
        return;
      }
    }

    setLoading(true);
    const res = await loginWithEmailOrUsername(cleanId, cleanPass);
    setLoading(false);

    if (!res.success) {
      if (res.notRegistered) {
        // User is not registered! Direct immediately to Register tab with pre-filled identifier
        setInfoMessage('Account not found! You must register an account first before signing in.');
        if (signinIdentifier.includes('@')) {
          setRegEmail(signinIdentifier.trim());
          setRegName(signinIdentifier.split('@')[0]);
        } else {
          setRegName(signinIdentifier.trim());
        }
        setActiveTab('register');
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    }
  };

  // 2. Register Submit Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your Name or Username.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMessage('Please enter a password.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setErrorMessage('Passwords do not match. Please check confirmation password.');
      return;
    }

    setLoading(true);
    const res = await signUpWithCredentials({
      nameOrUsername: regName.trim(),
      email: regEmail.trim(),
      pass: regPassword.trim(),
      passConfirm: regPasswordConfirm.trim()
    });
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to register account.');
    }
  };

  // 3. Forgot Password Submit Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccessMessage('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your registered email or username.');
      return;
    }
    if (!forgotNewPassword.trim()) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(forgotIdentifier.trim(), forgotNewPassword.trim());
    setLoading(false);

    if (res.success) {
      setForgotSuccessMessage('Password reset successfully! You can now sign in with your new password.');
      setSigninIdentifier(forgotIdentifier.trim());
      setTimeout(() => {
        setActiveTab('signin');
        setForgotSuccessMessage('');
      }, 2000);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. Please check your email or username.');
    }
  };

  // 4. Profile Password Reset (When logged in)
  const handleProfilePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileResetError('');
    setProfileResetSuccess('');

    if (!profileNewPassword.trim()) {
      setProfileResetError('Please enter your new password.');
      return;
    }
    if (profileNewPassword.length < 6) {
      setProfileResetError('Password must be at least 6 characters long.');
      return;
    }
    if (profileNewPassword !== profileConfirmPassword) {
      setProfileResetError('Passwords do not match.');
      return;
    }

    setProfileResetLoading(true);
    const res = await updateProfilePassword(profileNewPassword.trim());
    setProfileResetLoading(false);

    if (res.success) {
      setProfileResetSuccess('Your password has been changed successfully! 🔒');
      setProfileNewPassword('');
      setProfileConfirmPassword('');
      setTimeout(() => {
        setShowProfileResetSection(false);
        setProfileResetSuccess('');
      }, 2500);
    } else {
      setProfileResetError(res.error || 'Failed to update password.');
    }
  };

  // 5. VIP Passcode Submit
  const handleVipSubmit = async (e: React.FormEvent) => {
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
    if (!res.success) {
      setErrorMessage(res.error || 'Incorrect VIP password. Please check your passcode.');
    }
    setLoading(false);
  };

  // 6. Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await loginWithGoogle();
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
    setLoading(false);
  };

  const userOrdersCount = orders.filter(o => 
    currentUser && (o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() || o.userId === currentUser.uid)
  ).length;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={currentUser ? handleClose : undefined}
    >
      {/* 3D Interactive WebGL Background */}
      <Auth3DCanvas className="opacity-70" />

      <div className="relative w-full max-w-md my-8 z-10" onClick={(e) => e.stopPropagation()}>
        <Auth3DCard maxTilt={8} glowColor="rgba(175, 16, 26, 0.35)">
          <div className="relative w-full bg-[#1c1c1e] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden transform-style-3d">
            {/* Top Header Background Banner with 3D Depth */}
            <div className="relative bg-gradient-to-br from-[#121214] via-[#240a0e] to-[#af101a] text-white p-6 sm:p-7 text-center translate-z-20 border-b border-white/10">
              {/* Close button: ONLY visible when already logged in */}
              {currentUser && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Studio Brand Icon & Title */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-black/80 border-2 border-red-500/50 p-1 shadow-2xl shadow-black/80 mb-3 flex items-center justify-center translate-z-30 hover:scale-105 transition-transform">
                  <img 
                    src={imageConfig.logos.header} 
                    alt="Cabai Enterprise Logo" 
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = imageConfig.logos.favicon;
                    }}
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/60 border border-white/15 text-amber-300 text-[11px] font-mono-code font-bold tracking-wide uppercase mb-1.5 shadow-sm">
                  {currentUser?.role === 'vip' ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>VIP 3D Core Active</span>
                    </>
                  ) : currentUser ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Maker Pass Verified</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>3D Studio Pass</span>
                    </>
                  )}
                </div>

                <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white translate-z-20">
                  {currentUser 
                    ? (currentUser.role === 'vip' ? 'VIP Member Hub' : 'Maker Account')
                    : (activeTab === 'register' ? 'Register 3D Maker Account' : activeTab === 'forgot' ? 'Reset Password' : activeTab === 'vip' ? 'VIP Passcode Hub' : 'Sign In to Cabai 3D')}
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-xs leading-relaxed">
                  {currentUser 
                    ? 'Manage your account settings, password, and tracked 3D print orders.' 
                    : 'Need to register an account first before you can sign in to view orders and custom prints.'}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 bg-[#18181a] text-white">
          {currentUser ? (
            /* ========================================================================= */
            /* Logged-In User Profile View with Password Reset */
            /* ========================================================================= */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-12 h-12 rounded-full border-2 border-red-200 object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full font-extrabold text-lg flex items-center justify-center shadow-md ${
                    currentUser.role === 'vip' ? 'bg-[#1a1c1c] text-amber-300' : 'bg-[#af101a] text-white'
                  }`}>
                    {currentUser.role === 'vip' ? '👑' : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {currentUser.displayName || currentUser.username || 'Maker Member'}
                    </h3>
                    {currentUser.role === 'vip' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black text-amber-300 border border-amber-400/40">
                        <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span>VIP</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                    {currentUser.role === 'vip' 
                      ? (currentUser.phone ? `Phone: ${currentUser.phone}` : 'VIP Access Member') 
                      : (currentUser.email || (currentUser.username ? `@${currentUser.username}` : 'Registered Account'))}
                  </p>
                </div>
              </div>

              {/* VIP Phone Detail Badge if VIP */}
              {currentUser.role === 'vip' && (currentUser.phone || currentUser.phoneNumber) && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-xs font-bold text-amber-900">VIP Contact Phone:</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                    {currentUser.phone || currentUser.phoneNumber}
                  </span>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-[#af101a]">
                    {userOrdersCount}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Orders Tracked
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-xl font-heading font-extrabold text-green-700">
                    Verified
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">
                    Account Status
                  </div>
                </div>
              </div>

              {/* Password Reset Section on Profile Page */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-700" />
                    <span className="text-xs font-bold text-gray-900">Security &amp; Password</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileResetSection(!showProfileResetSection);
                      setProfileResetError('');
                      setProfileResetSuccess('');
                    }}
                    className="text-xs font-bold text-[#af101a] hover:underline cursor-pointer"
                  >
                    {showProfileResetSection ? 'Cancel' : 'Reset Password'}
                  </button>
                </div>

                {showProfileResetSection && (
                  <form onSubmit={handleProfilePasswordReset} className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                    {profileResetSuccess && (
                      <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{profileResetSuccess}</span>
                      </div>
                    )}
                    {profileResetError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{profileResetError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        New Password (min 6 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showProfilePassword ? 'text' : 'password'}
                          value={profileNewPassword}
                          onChange={(e) => setProfileNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowProfilePassword(!showProfilePassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                        >
                          {showProfilePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showProfilePassword ? 'text' : 'password'}
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileResetLoading}
                      className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {profileResetLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span>Update New Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('order_tracking');
                  }}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-red-400" />
                  <span>View My Orders &amp; Track Status</span>
                </button>

                <button
                  onClick={() => logout()}
                  className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* Authentication Screens: Sign In, Register, Forgot Password, VIP */
            /* ========================================================================= */
            <div className="space-y-5">
              {/* Tab Selector: Sign In & Register */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMessage(''); setInfoMessage(''); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'signin' 
                      ? 'bg-white text-gray-900 shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#af101a]" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMessage(''); setInfoMessage(''); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'register' 
                      ? 'bg-gradient-to-r from-[#af101a] to-[#8d0a12] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>Register Account</span>
                </button>
              </div>

              {/* Requirement Alert: "REMEMBER NEED TO REGISTER ACC FIRST THEN CAN ONLY SIGN IN" */}
              <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                  <span className="font-extrabold uppercase text-amber-950">Notice: </span>
                  You need to <button type="button" onClick={() => setActiveTab('register')} className="underline font-bold text-[#af101a] cursor-pointer">register an account first</button> before you can sign in to view orders and custom prints.
                </p>
              </div>

              {/* Notification Banner (Info or Redirect Notice) */}
              {infoMessage && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{infoMessage}</span>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Success Notification for Forgot Password */}
              {forgotSuccessMessage && (
                <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{forgotSuccessMessage}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* 1. SIGN IN VIEW (Email / Username + Password + Forgot Password) */}
              {/* ========================================================= */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSigninSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email or Username <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signinIdentifier}
                        onChange={(e) => setSigninIdentifier(e.target.value)}
                        placeholder="e.g. john_doe or you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Password <span className="text-[#af101a]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotIdentifier(signinIdentifier);
                          setActiveTab('forgot');
                          setErrorMessage('');
                          setInfoMessage('');
                        }}
                        className="text-xs font-bold text-[#af101a] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSigninPassword ? 'text' : 'password'}
                        value={signinPassword}
                        onChange={(e) => setSigninPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSigninPassword(!showSigninPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        title={showSigninPassword ? "Hide password" : "Show password"}
                      >
                        {showSigninPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#af101a] hover:bg-[#8d0a12] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                      Don&apos;t have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => { setActiveTab('register'); setErrorMessage(''); setInfoMessage(''); }}
                        className="font-bold text-[#af101a] hover:underline cursor-pointer"
                      >
                        Register now
                      </button>
                    </p>
                  </div>

                  {/* Secondary Access: VIP Passcode & Google */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('vip'); setErrorMessage(''); }}
                      className="hover:text-amber-800 flex items-center gap-1 text-amber-700 cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>VIP Passcode</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="hover:text-blue-700 flex items-center gap-1 text-blue-600 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google Login</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* 2. REGISTER VIEW (Name/Username + Email + Pass + Confirm) */}
              {/* ========================================================= */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Name / Username <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. John Doe or maker_johndoe"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Password (min 6 characters) <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Confirm Password <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPasswordConfirm}
                        onChange={(e) => setRegPasswordConfirm(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#af101a] to-[#8d0a12] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create &amp; Register Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setActiveTab('signin'); setErrorMessage(''); setInfoMessage(''); }}
                        className="font-bold text-[#af101a] hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* 3. FORGOT PASSWORD VIEW */}
              {/* ========================================================= */}
              {activeTab === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  <div className="p-3 bg-red-50/80 border border-red-100 rounded-xl text-left">
                    <div className="flex items-center gap-1.5 text-[#af101a] font-bold text-xs mb-0.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>Password Reset Assistance</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Enter your registered email or username and choose a new password to restore access.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Registered Email or Username <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="e.g. yourname@example.com or username"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      New Password (min 6 characters) <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotPass ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotPass(!showForgotPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        {showForgotPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Confirm New Password <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotPass ? 'text' : 'password'}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gray-900 hover:bg-black active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Save &amp; Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* 4. VIP PASSCODE & PHONE VIEW */}
              {/* ========================================================= */}
              {activeTab === 'vip' && (
                <form onSubmit={handleVipSubmit} className="space-y-4">
                  <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-left">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                      <Crown className="w-4 h-4 text-amber-700 fill-amber-700" />
                      <span>VIP Member Sign In</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Enter your authorized VIP passcode and mobile phone number to authenticate and access VIP studio privileges.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      VIP Access Passcode <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showVipPassword ? 'text' : 'password'}
                        value={vipPasscode}
                        onChange={(e) => setVipPasscode(e.target.value)}
                        placeholder="Enter VIP passcode (e.g. hkylovenbx)"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowVipPassword(!showVipPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        title={showVipPassword ? "Hide passcode" : "Show passcode"}
                      >
                        {showVipPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      VIP Phone Number (WhatsApp / Mobile) <span className="text-[#af101a]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={vipPhone}
                        onChange={(e) => setVipPhone(e.target.value)}
                        placeholder="e.g. 012-345 6789"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-hidden transition-all"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Required for every VIP sign in to link your custom orders and VIP perks.
                    </p>
                  </div>

                  {/* VIP Unlock Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#af101a] to-[#8d0a12] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Sign In as VIP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Trust Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-3 text-[11px] font-mono-code text-white/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>3D Secure Auth</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Encrypted Storage</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Auth3DCard>
  </div>
</div>
);
};
