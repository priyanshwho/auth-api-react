import { useState } from 'react';
import type { FormEvent, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';

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

const Login: FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!usernameOrEmail.trim()) newErrors.usernameOrEmail = 'Please enter your username or email.';
    if (!password) newErrors.password = 'Please enter your password.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(usernameOrEmail.trim(), password, rememberMe);
      navigate('/', { replace: true });
    } catch {
      // Error toast handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to continue to your dashboard."
      heroTitle={'Security made\nbeautiful.'}
      heroSubtitle="Sign in to your account"
      footerText="Don't have an account?"
      footerLinkLabel="Create one"
      footerLinkTo="/register"
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
            id="login-username-email"
            label="Username or Email"
            type="text"
            placeholder="Enter your username or email"
            icon={User}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            error={errors.usernameOrEmail}
            autoComplete="username"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InputField
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
        </motion.div>

        {/* Remember Me */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
          <button
            type="button"
            id="remember-me-toggle"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
              rememberMe
                ? 'bg-steel-blue border-steel-blue dark:bg-sky-blue dark:border-sky-blue'
                : 'bg-transparent border-deep-navy/25 dark:border-cloud-white/25 hover:border-steel-blue dark:hover:border-sky-blue'
            }`}
          >
            {rememberMe && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <label
            htmlFor="remember-me-toggle"
            className="text-xs font-medium text-deep-navy/60 dark:text-cloud-white/50 select-none cursor-pointer"
            onClick={() => setRememberMe(!rememberMe)}
          >
            Keep me signed in
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            id="login-submit-btn"
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
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-5 text-center text-xs text-deep-navy/40 dark:text-cloud-white/30">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-steel-blue dark:text-sky-blue hover:underline">
            Register here
          </Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;
