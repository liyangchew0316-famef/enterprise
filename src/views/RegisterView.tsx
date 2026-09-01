import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Circle, Chrome, Github, Eye, EyeOff, ArrowLeft, Box, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../lib/firebase';
import { Auth3DCanvas } from '../components/Auth3DCanvas';
import { Auth3DCard } from '../components/Auth3DCard';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from 'firebase/auth';
import { saveUserToFirestore } from '../lib/firestoreService';
import { UserProfile } from '../types';
import imgWorkshopBg from '../assets/images/cabai_3d_workshop_bg_1787834261436.jpg';

// ==================================================
// REUSABLE SUB-COMPONENTS
// ==================================================

export interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

export const StepItem: React.FC<StepItemProps> = ({ number, text, active = false }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        active
          ? 'bg-white text-black border border-white'
          : 'bg-[#18181B] text-white border border-white/10'
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
          active
            ? 'bg-black text-white'
            : 'bg-white/10 text-white/40'
        }`}
      >
        {number}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2.5 h-11 bg-[#18181B] border border-white/10 rounded-xl hover:bg-[#27272A] hover:border-white/20 text-white text-xs font-mono-code font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full px-3"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
};

export interface InputGroupProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  name,
  error,
  autoComplete,
  required = false
}) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="block text-xs font-mono-code font-bold text-white/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full bg-[#18181B] rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border text-xs font-mono-code transition-all ${
          error ? 'border-red-500/80 focus:ring-red-500/50' : 'border-white/10'
        }`}
      />
      {error && <p className="text-xs text-red-400 font-mono-code mt-1">{error}</p>}
    </div>
  );
};

export interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name = 'password',
  error,
  hint,
  autoComplete = 'new-password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="block text-xs font-mono-code font-bold text-white/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-[#18181B] rounded-xl h-11 pl-4 pr-11 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#AF101A] focus:border-[#AF101A] border text-xs font-mono-code transition-all ${
            error ? 'border-red-500/80 focus:ring-red-500/50' : 'border-white/10'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-white/30 font-mono-code">{hint}</p>}
      {error && <p className="text-xs text-red-400 font-mono-code mt-1">{error}</p>}
    </div>
  );
};

// ==================================================
// MAIN REGISTER VIEW
// ==================================================

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentView, setIsAuthModalOpen, currentUser } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/home';

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(redirectUrl, { replace: true });
    }
  }, [currentUser, navigate, redirectUrl]);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Validation State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Cabai Enterprise — Create Account';
  }, []);

  // Animation variants
  const leftContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const leftChildVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Requires at least 8 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const displayName = `${cleanFirstName} ${cleanLastName}`;

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 2. Update Auth display name
      try {
        await updateProfile(user, { displayName });
      } catch (err) {
        console.warn('Profile update note:', err);
      }

      // 3. Save basic customer profile to Firestore (WITHOUT password)
      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        displayName: displayName,
        photoURL: null,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'email_password',
        createdAt: now,
        signedUpAt: now
      });

      // Save active profile to localStorage for quick hydration
      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      // 4. Redirect to customer dashboard/home
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setFormError('An account with this email address already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setFieldErrors(prev => ({ ...prev, password: 'Password is too weak. Requires at least 8 characters.' }));
      } else if (err.code === 'auth/invalid-email') {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      } else {
        setFormError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const names = (user.displayName || '').split(' ');
      const gFirstName = names[0] || 'Maker';
      const gLastName = names.slice(1).join(' ') || '';

      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: gFirstName,
        lastName: gLastName,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Maker',
        photoURL: user.photoURL,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'google',
        createdAt: now,
        signedUpAt: now
      });

      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled popup, do nothing
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setFormError('Google sign-in is not enabled in Firebase Console. Please register with Email.');
      } else {
        setFormError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setFormError('');
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const names = (user.displayName || '').split(' ');
      const ghFirstName = names[0] || 'Maker';
      const ghLastName = names.slice(1).join(' ') || '';

      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: user.uid,
        firstName: ghFirstName,
        lastName: ghLastName,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Maker',
        photoURL: user.photoURL,
        isAnonymous: false,
        role: 'customer',
        createdAt: now
      };

      await saveUserToFirestore({
        ...profile,
        authProvider: 'github',
        createdAt: now,
        signedUpAt: now
      });

      try {
        localStorage.setItem('cabai_saved_user', JSON.stringify(profile));
      } catch (e) {}

      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      console.error('GitHub Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // Cancelled
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setFormError('GitHub sign-in is not configured in Firebase. Please use Google or Email registration.');
      } else {
        setFormError(err.message || 'GitHub sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#111113] selection:bg-[#AF101A]/30 p-2 lg:p-4 font-sans text-white flex flex-col lg:flex-row items-center justify-center overflow-x-hidden">
      {/* 3D Interactive WebGL Background */}
      <Auth3DCanvas className="opacity-70" />

      {/* Back to Landing Page */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] text-white text-xs font-mono-code font-bold backdrop-blur-md transition-all cursor-pointer border border-white/10 shadow-xl"
        title="Back to Cabai Enterprise"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Cabai</span>
      </Link>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 my-auto py-8">
        {/* LEFT: Brand / 3D Maker Studio section (Desktop) */}
        <div className="hidden lg:flex w-[46%] flex-col justify-between p-8 rounded-3xl bg-[#18181B]/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-[#FF4D5A] text-xs font-mono-code font-bold">
              <Box className="w-3.5 h-3.5 animate-spin text-[#FF4D5A]" />
              <span>CABAI 3D ENGINE v2.6</span>
            </div>

            <div>
              <h2 className="text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
                Craft Physical Reality in 3D.
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-3 leading-relaxed">
                Join Malaysia&apos;s custom maker hub. Direct slice-to-order pipeline, industrial PLA-CF precision, and tracked production stages.
              </p>
            </div>

            {/* Registration 3D Steps */}
            <div className="space-y-3 pt-2 font-mono-code">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111113] border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#AF101A] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Create Maker Account</h4>
                  <p className="text-[11px] text-white/50">Personalized print queue &amp; order history</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111113]/60 border border-white/10 opacity-70">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white/70 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Explore &amp; Custom Slicer</h4>
                  <p className="text-[11px] text-white/50">Interactive 3D preview &amp; color selection</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111113]/40 border border-white/10 opacity-50">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white/70 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Precision Production</h4>
                  <p className="text-[11px] text-white/50">0.12mm layer height crafted &amp; dispatched</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono-code">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time WebGL 3D</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Cloud Auth</span>
            </span>
          </div>
        </div>

        {/* RIGHT: 3D Perspective Registration Card */}
        <div className="w-full lg:w-[54%] max-w-lg">
          <Auth3DCard maxTilt={8} glowColor="rgba(175, 16, 26, 0.4)">
            <div className="bg-[#111113]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transform-style-3d">
              {/* Form Header */}
              <div className="space-y-1.5 text-left translate-z-20">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 text-[#FF4D5A] text-[10px] font-mono-code font-bold tracking-wide uppercase border border-red-800/80 mb-1">
                  New Maker Registration
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white">
                  Join Cabai 3D Studio
                </h1>
                <p className="text-white/50 text-xs sm:text-sm">
                  Register your account first to access 3D order tracking &amp; custom creations.
                </p>
              </div>

              {/* Social Login Buttons with 3D Depth */}
              <div className="grid grid-cols-2 gap-3 translate-z-10">
                <SocialButton
                  icon={<Chrome className="w-4 h-4 text-white" />}
                  label="Google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                />
                <SocialButton
                  icon={<Github className="w-4 h-4 text-white" />}
                  label="GitHub"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative bg-[#111113] px-3 text-[10px] font-mono-code text-white/40 uppercase tracking-widest">
                  Or Email Pass
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-3.5 text-left" noValidate>
                {formError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 font-mono-code">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <InputGroup
                    label="First Name"
                    placeholder="e.g. Alex"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    autoComplete="given-name"
                    error={fieldErrors.firstName}
                    required
                  />
                  <InputGroup
                    label="Last Name"
                    placeholder="e.g. Tan"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: '' }));
                    }}
                    autoComplete="family-name"
                    error={fieldErrors.lastName}
                    required
                  />
                </div>

                {/* Row 2: Email Address */}
                <InputGroup
                  label="Email Address"
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  autoComplete="email"
                  error={fieldErrors.email}
                  required
                />

                {/* Row 3: Password */}
                <PasswordInput
                  label="Password"
                  placeholder="Minimum 8 characters"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  hint="Requires at least 8 characters."
                  autoComplete="new-password"
                  error={fieldErrors.password}
                />

                {/* Row 4: Confirm Password */}
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  autoComplete="new-password"
                  error={fieldErrors.confirmPassword}
                />

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.98] text-white font-mono-code font-bold rounded-xl shadow-lg shadow-red-950/50 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider translate-z-20"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Maker Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete 3D Registration</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Footer */}
              <div className="text-center pt-1 border-t border-white/10 font-mono-code">
                <p className="text-white/60 text-xs">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    className="text-[#FF4D5A] hover:text-white font-bold hover:underline transition-all cursor-pointer inline-block ml-1"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </div>
          </Auth3DCard>
        </div>
      </div>
    </div>
  );
};
