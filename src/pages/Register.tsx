import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ChevronDown, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validateUsername, validatePassword } from '../utils/validators';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

type Role = 'USER' | 'ADMIN';
const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'USER', label: 'User', description: 'Standard access to the platform' },
  { value: 'ADMIN', label: 'Admin', description: 'Full administrative privileges' },
];

const Register: FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Must be 3–20 chars, letters, numbers & underscores only.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password, role);
      navigate('/login', { replace: true });
    } catch {
      // Error toast handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Create account"
      subheading="Join Velora Auth and experience secure access."
      heroTitle={'Trust starts\nwith access.'}
      heroSubtitle="Create your account"
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    >
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        noValidate
      >
        <motion.div variants={itemVariants}>
          <InputField
            id="register-username"
            label="Username"
            type="text"
            placeholder="Choose a unique username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            autoComplete="username"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InputField
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InputField
            id="register-password"
            label="Password"
            type="password"
            placeholder="Create a secure password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
        </motion.div>

        {/* Custom Role Selector */}
        <motion.div variants={itemVariants} className="mb-5">
          <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase text-deep-navy/60 dark:text-cloud-white/50">
            Account Role
          </label>
          <div className="relative">
            <button
              id="role-selector-btn"
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`w-full h-11 pl-11 pr-4 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all duration-300 ${
                roleDropdownOpen
                  ? 'glass-input bg-white/70 dark:bg-nebula-dark/60 border-steel-blue/50 dark:border-sky-blue/50 shadow-[0_0_0_4px_rgba(92,122,234,0.1)] dark:shadow-[0_0_0_4px_rgba(142,202,230,0.1)]'
                  : 'glass-input'
              } text-deep-navy dark:text-cloud-white`}
            >
              <div className="absolute left-3.5 text-deep-navy/40 dark:text-cloud-white/30 pointer-events-none">
                <ShieldCheck size={18} strokeWidth={2} />
              </div>
              <span>{ROLES.find((r) => r.value === role)?.label}</span>
              <motion.span
                animate={{ rotate: roleDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-deep-navy/40 dark:text-cloud-white/30"
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 4, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 z-20 glass-panel-elevated rounded-xl overflow-hidden border border-white/40 dark:border-white/10 shadow-xl"
                >
                  {ROLES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRole(option.value);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                        role === option.value
                          ? 'bg-steel-blue/8 dark:bg-sky-blue/8'
                          : 'hover:bg-deep-navy/4 dark:hover:bg-cloud-white/4'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${role === option.value ? 'bg-steel-blue dark:bg-sky-blue' : 'bg-deep-navy/20 dark:bg-cloud-white/20'}`} />
                      <div>
                        <p className="text-sm font-semibold text-deep-navy dark:text-cloud-white">{option.label}</p>
                        <p className="text-[11px] text-deep-navy/45 dark:text-cloud-white/40">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <motion.button
            id="register-submit-btn"
            type="submit"
            disabled={submitting || loading}
            whileHover={{ scale: submitting ? 1 : 1.015 }}
            whileTap={{ scale: submitting ? 1 : 0.985 }}
            className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-steel-blue to-deep-navy dark:from-sky-blue dark:to-steel-blue dark:text-white shadow-md hover:shadow-lg hover:shadow-steel-blue/20 dark:hover:shadow-sky-blue/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Register;
