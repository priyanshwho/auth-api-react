import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validateUsername, validatePassword } from '../utils/validators';

type Mode = 'signin' | 'signup';
type Role = 'USER' | 'ADMIN';

const FloatingBlob: React.FC<{ className: string; delay?: number }> = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ x: [0, 30, -20, 10, 0], y: [0, -40, 25, -15, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
    transition={{ duration: 20, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ReactNode;
  isPassword?: boolean;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', placeholder, value, onChange, error, icon, isPassword }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className={`mb-1 text-[10px] font-bold tracking-widest uppercase transition-colors duration-200 ${error ? 'text-red-500' : focused ? 'text-steel-blue dark:text-sky-blue' : 'text-deep-navy/50 dark:text-cloud-white/45'}`}>
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${error ? 'text-red-400' : focused ? 'text-steel-blue dark:text-sky-blue' : 'text-deep-navy/35 dark:text-cloud-white/30'}`}>
          {icon}
        </span>
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          className={`w-full h-10 pl-10 ${isPassword ? 'pr-10' : 'pr-4'} rounded-xl text-sm font-medium text-deep-navy dark:text-cloud-white transition-all duration-300 ${
            error
              ? 'bg-red-500/5 border border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:outline-none'
              : 'glass-input'
          }`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-navy/35 dark:text-cloud-white/30 hover:text-deep-navy/60 dark:hover:text-cloud-white/60 transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 4 }} exit={{ opacity: 0, height: 0 }} className="text-[10px] font-semibold text-red-500">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const ROLES: { value: Role; label: string }[] = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

export const AuthSwitch: React.FC<{ initialMode?: Mode }> = ({ initialMode = 'signin' }) => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [submitting, setSubmitting] = useState(false);

  // Sign-in state
  const [siCredential, setSiCredential] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [siErrors, setSiErrors] = useState<{ credential?: string; password?: string }>({});

  // Sign-up state
  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suRole, setSuRole] = useState<Role>('USER');
  const [suRoleOpen, setSuRoleOpen] = useState(false);
  const [suErrors, setSuErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const switchMode = (next: Mode) => {
    setMode(next);
    setSiErrors({});
    setSuErrors({});
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof siErrors = {};
    if (!siCredential.trim()) errs.credential = 'Please enter your username or email.';
    if (!siPassword) errs.password = 'Please enter your password.';
    else if (siPassword.length < 6) errs.password = 'Password must be at least 6 characters.';
    setSiErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await login(siCredential.trim(), siPassword, rememberMe);
      navigate('/', { replace: true });
    } catch { /* toast handled in context */ }
    finally { setSubmitting(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof suErrors = {};
    if (!suUsername.trim()) errs.username = 'Username is required.';
    else if (!validateUsername(suUsername)) errs.username = '3–20 chars, letters, numbers & underscores only.';
    if (!suEmail.trim()) errs.email = 'Email is required.';
    else if (!validateEmail(suEmail)) errs.email = 'Enter a valid email address.';
    if (!suPassword) errs.password = 'Password is required.';
    else if (!validatePassword(suPassword)) errs.password = 'Minimum 6 characters.';
    setSuErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await register(suUsername.trim(), suEmail.trim(), suPassword, suRole);
      switchMode('signin');
    } catch { /* toast handled in context */ }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud-white dark:bg-nebula-deep transition-colors duration-500 bg-grain px-4 py-10 relative overflow-hidden">
      {/* Ambient blobs */}
      <FloatingBlob className="w-[500px] h-[500px] bg-powder-blue/25 dark:bg-steel-blue/8 -top-48 -left-40" delay={0} />
      <FloatingBlob className="w-96 h-96 bg-sky-blue/20 dark:bg-sky-blue/6 -bottom-32 -right-28" delay={4} />
      <FloatingBlob className="w-72 h-72 bg-soft-cyan/25 dark:bg-powder-blue/5 top-1/3 right-1/4" delay={8} />

      {/* Card container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Mode Toggle Tabs */}
        <div className="glass-panel rounded-2xl p-1 flex mb-4 relative">
          <motion.div
            layoutId="tab-bg"
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white dark:bg-nebula-dark shadow-sm"
            animate={{ left: mode === 'signin' ? '4px' : 'calc(50%)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`relative z-10 flex-1 py-2 text-xs font-bold tracking-wide rounded-xl transition-colors duration-300 ${
                mode === m
                  ? 'text-deep-navy dark:text-cloud-white'
                  : 'text-deep-navy/40 dark:text-cloud-white/35 hover:text-deep-navy/70 dark:hover:text-cloud-white/60'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Animated Form Card */}
        <div className="glass-panel-elevated rounded-2xl overflow-hidden">
          {/* Hero Strip */}
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-powder-blue via-sky-blue to-steel-blue/80 dark:from-nebula-dark dark:via-deep-navy dark:to-nebula-deep" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
                      <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill="white" fillOpacity="0.4" />
                    </svg>
                  </div>
                  <span className="font-display font-semibold text-xs tracking-widest uppercase text-white/80">Velora Auth</span>
                </div>
                <h2 className="font-display font-bold text-lg text-white leading-tight">
                  {mode === 'signin' ? 'Welcome back' : 'Create account'}
                </h2>
              </motion.div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/5" />
            <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-white/5" />
          </div>

          {/* Forms with AnimatePresence */}
          <div className="p-7 pt-6">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'signin' ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSignIn}
                  noValidate
                >
                  <Field id="si-credential" label="Username or Email" placeholder="Enter username or email" value={siCredential} onChange={setSiCredential} error={siErrors.credential} icon={<User size={15} />} />
                  <Field id="si-password" label="Password" placeholder="Enter password" value={siPassword} onChange={setSiPassword} error={siErrors.password} icon={<Lock size={15} />} isPassword />

                  {/* Remember me */}
                  <div className="flex items-center gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all duration-200 ${rememberMe ? 'bg-steel-blue border-steel-blue dark:bg-sky-blue dark:border-sky-blue' : 'bg-transparent border-deep-navy/25 dark:border-cloud-white/25'}`}
                    >
                      {rememberMe && <svg width="8" height="6" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                    <span onClick={() => setRememberMe(!rememberMe)} className="text-xs text-deep-navy/55 dark:text-cloud-white/45 cursor-pointer select-none">Keep me signed in</span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting || loading}
                    whileHover={{ scale: submitting ? 1 : 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full h-10 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-steel-blue to-deep-navy dark:from-sky-blue dark:to-steel-blue shadow-md hover:shadow-lg hover:shadow-steel-blue/25 disabled:opacity-60 transition-all duration-300"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Signing in...
                      </span>
                    ) : 'Sign In'}
                  </motion.button>

                  <p className="mt-4 text-center text-xs text-deep-navy/45 dark:text-cloud-white/35">
                    No account?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-steel-blue dark:text-sky-blue hover:underline">
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSignUp}
                  noValidate
                >
                  <Field id="su-username" label="Username" placeholder="Choose a username" value={suUsername} onChange={setSuUsername} error={suErrors.username} icon={<User size={15} />} />
                  <Field id="su-email" label="Email" type="email" placeholder="Enter your email" value={suEmail} onChange={setSuEmail} error={suErrors.email} icon={<Mail size={15} />} />
                  <Field id="su-password" label="Password" placeholder="Create a password" value={suPassword} onChange={setSuPassword} error={suErrors.password} icon={<Lock size={15} />} isPassword />

                  {/* Role Selector */}
                  <div className="mb-5">
                    <label className="mb-1 block text-[10px] font-bold tracking-widest uppercase text-deep-navy/50 dark:text-cloud-white/45">Account Role</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSuRoleOpen(!suRoleOpen)}
                        className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm font-medium text-left flex items-center justify-between glass-input text-deep-navy dark:text-cloud-white transition-all duration-200 ${suRoleOpen ? 'border-steel-blue/50 dark:border-sky-blue/50 shadow-[0_0_0_3px_rgba(92,122,234,0.1)]' : ''}`}
                      >
                        <ShieldCheck size={15} className="absolute left-3.5 text-deep-navy/35 dark:text-cloud-white/30 pointer-events-none" />
                        <span>{ROLES.find(r => r.value === suRole)?.label}</span>
                        <motion.span animate={{ rotate: suRoleOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-deep-navy/35 dark:text-cloud-white/30">
                          <ChevronDown size={14} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {suRoleOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                            animate={{ opacity: 1, y: 2, scaleY: 1 }}
                            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                            style={{ originY: 0 }}
                            className="absolute top-full left-0 right-0 z-20 glass-panel-elevated rounded-xl overflow-hidden shadow-xl"
                          >
                            {ROLES.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setSuRole(opt.value); setSuRoleOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors ${suRole === opt.value ? 'bg-steel-blue/8 dark:bg-sky-blue/8 text-deep-navy dark:text-cloud-white' : 'text-deep-navy/70 dark:text-cloud-white/60 hover:bg-deep-navy/4 dark:hover:bg-cloud-white/4'}`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${suRole === opt.value ? 'bg-steel-blue dark:bg-sky-blue' : 'bg-deep-navy/20 dark:bg-cloud-white/20'}`} />
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting || loading}
                    whileHover={{ scale: submitting ? 1 : 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full h-10 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-steel-blue to-deep-navy dark:from-sky-blue dark:to-steel-blue shadow-md hover:shadow-lg hover:shadow-steel-blue/25 disabled:opacity-60 transition-all duration-300"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Creating account...
                      </span>
                    ) : 'Create Account'}
                  </motion.button>

                  <p className="mt-4 text-center text-xs text-deep-navy/45 dark:text-cloud-white/35">
                    Already registered?{' '}
                    <button type="button" onClick={() => switchMode('signin')} className="font-semibold text-steel-blue dark:text-sky-blue hover:underline">
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom label */}
        <p className="mt-5 text-center text-[11px] text-deep-navy/30 dark:text-cloud-white/25">
          Powered by FreeAPI · Velora Auth
        </p>
      </div>
    </div>
  );
};

export default AuthSwitch;
