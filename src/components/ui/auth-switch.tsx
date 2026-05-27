import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, ShieldCheck, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateUsername, validatePassword } from "@/utils/validators";

type Mode = "signin" | "signup";
type Role = "USER" | "ADMIN";

/* ─────────────────────────────────────────────────────
   SHARED INPUT FIELD
   Uses theme-aware classes so it looks correct in both
   light (cloud-white bg) and dark (nebula bg) modes.
──────────────────────────────────────────────────────── */
function Field({
  id, label, type = "text", placeholder, value, onChange, error, icon, isPassword,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ReactNode;
  isPassword?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1 mb-3.5 text-left">
      <label
        htmlFor={id}
        className={cn(
          "text-[10px] font-bold tracking-widest uppercase transition-colors duration-200",
          error
            ? "text-red-500 dark:text-red-400"
            : focused
            ? "text-steel-blue dark:text-sky-blue"
            : "text-deep-navy/50 dark:text-white/40"
        )}
      >
        {label}
      </label>

      <div className="relative">
        <span
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200",
            error
              ? "text-red-500 dark:text-red-400"
              : focused
              ? "text-steel-blue dark:text-sky-blue"
              : "text-deep-navy/35 dark:text-white/30"
          )}
        >
          {icon}
        </span>

        <input
          id={id}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-10 pl-10 rounded-xl text-sm font-medium outline-none transition-all duration-300",
            isPassword ? "pr-10" : "pr-4",
            /* text and placeholder */
            "text-deep-navy dark:text-white",
            "placeholder:text-deep-navy/30 dark:placeholder:text-white/25",
            /* base bg + border */
            error
              ? "bg-red-500/8 border border-red-500/50 dark:bg-red-500/10 dark:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
              : "bg-deep-navy/5 dark:bg-white/8 border border-deep-navy/12 dark:border-white/10 focus:border-steel-blue/60 dark:focus:border-sky-blue/60 focus:bg-white/70 dark:focus:bg-white/12 focus:shadow-[0_0_0_3px_rgba(92,122,234,0.12)] dark:focus:shadow-[0_0_0_3px_rgba(142,202,230,0.12)]"
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-navy/35 dark:text-white/30 hover:text-deep-navy/70 dark:hover:text-white/60 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-semibold text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SIGN-IN FORM
──────────────────────────────────────────────────────── */
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ credential?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!credential.trim()) errs.credential = "Username or email is required.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Minimum 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await login(credential.trim(), password, remember);
      navigate("/", { replace: true });
    } catch {
      /* toast handled in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      key="signin-form"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full"
    >
      <h2 className="font-display font-bold text-2xl text-deep-navy dark:text-white mb-1 tracking-tight">
        Sign in
      </h2>
      <p className="text-deep-navy/45 dark:text-white/40 text-xs mb-6">Access your Velora account</p>

      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <Field
          id="si-cred"
          label="Username or Email"
          placeholder="Enter username or email"
          value={credential}
          onChange={setCredential}
          error={errors.credential}
          icon={<User size={15} />}
        />
        <Field
          id="si-pass"
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          icon={<Lock size={15} />}
          isPassword
        />

        {/* Remember me */}
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRemember(!remember)}
            className={cn(
              "w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0 transition-all duration-200",
              remember
                ? "bg-steel-blue border-steel-blue dark:bg-sky-blue dark:border-sky-blue"
                : "bg-transparent border-deep-navy/25 dark:border-white/25"
            )}
          >
            {remember && (
              <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span
            onClick={() => setRemember(!remember)}
            className="text-xs text-deep-navy/50 dark:text-white/40 cursor-pointer select-none"
          >
            Keep me signed in
          </span>
        </div>

        <motion.button
          type="submit"
          disabled={submitting || loading}
          whileHover={{ scale: submitting ? 1 : 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="w-full h-10 rounded-xl font-bold text-sm text-deep-navy bg-gradient-to-r from-sky-blue to-powder-blue shadow-lg shadow-sky-blue/25 hover:shadow-sky-blue/40 disabled:opacity-60 transition-all duration-300"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>

      {/* Mobile-only switch link */}
      <p className="mt-5 text-xs text-deep-navy/40 dark:text-white/30 lg:hidden">
        No account?{" "}
        <button onClick={onSwitch} className="text-steel-blue dark:text-sky-blue font-semibold hover:underline">
          Create one
        </button>
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   SIGN-UP FORM
──────────────────────────────────────────────────────── */
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [roleOpen, setRoleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!username.trim()) errs.username = "Username is required.";
    else if (!validateUsername(username)) errs.username = "3–20 chars, letters/numbers/underscores.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (!validatePassword(password)) errs.password = "Minimum 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password, role);
      navigate("/login", { replace: true });
    } catch {
      /* toast handled in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      key="signup-form"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full"
    >
      <h2 className="font-display font-bold text-2xl text-deep-navy dark:text-white mb-1 tracking-tight">
        Create account
      </h2>
      <p className="text-deep-navy/45 dark:text-white/40 text-xs mb-5">Join Velora Auth today</p>

      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <Field id="su-user" label="Username" placeholder="Choose a username"
          value={username} onChange={setUsername} error={errors.username} icon={<User size={15} />} />
        <Field id="su-email" label="Email" type="email" placeholder="Your email address"
          value={email} onChange={setEmail} error={errors.email} icon={<Mail size={15} />} />
        <Field id="su-pass" label="Password" placeholder="Create a secure password"
          value={password} onChange={setPassword} error={errors.password} icon={<Lock size={15} />} isPassword />

        {/* Role selector */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-deep-navy/50 dark:text-white/40 mb-1">
            Role
          </label>
          <div className="relative">
            <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-deep-navy/35 dark:text-white/30 pointer-events-none" />
            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full h-10 pl-10 pr-4 rounded-xl text-sm font-medium text-deep-navy dark:text-white text-left flex items-center justify-between bg-deep-navy/5 dark:bg-white/8 border border-deep-navy/12 dark:border-white/10 hover:border-deep-navy/25 dark:hover:border-white/20 transition-all duration-200"
            >
              <span>{role === "USER" ? "User" : "Admin"}</span>
              <motion.span animate={{ rotate: roleOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-deep-navy/35 dark:text-white/30" />
              </motion.span>
            </button>

            <AnimatePresence>
              {roleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 2, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  style={{ originY: 0 }}
                  className="absolute top-full left-0 right-0 z-30 rounded-xl overflow-hidden border border-deep-navy/10 dark:border-white/10 shadow-xl backdrop-blur-xl bg-cloud-white/95 dark:bg-nebula-dark/95"
                >
                  {([ ["USER", "User"], ["ADMIN", "Admin"] ] as [Role, string][]).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setRole(val); setRoleOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors",
                        role === val
                          ? "bg-steel-blue/8 dark:bg-sky-blue/10 text-steel-blue dark:text-sky-blue"
                          : "text-deep-navy/70 dark:text-white/60 hover:bg-deep-navy/4 dark:hover:bg-white/5"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full", role === val ? "bg-steel-blue dark:bg-sky-blue" : "bg-deep-navy/20 dark:bg-white/20")} />
                      {lbl}
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
          className="w-full h-10 rounded-xl font-bold text-sm text-deep-navy bg-gradient-to-r from-sky-blue to-powder-blue shadow-lg shadow-sky-blue/25 hover:shadow-sky-blue/40 disabled:opacity-60 transition-all duration-300"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
          ) : (
            "Create Account"
          )}
        </motion.button>
      </form>

      {/* Mobile-only switch link */}
      <p className="mt-4 text-xs text-deep-navy/40 dark:text-white/30 lg:hidden">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-steel-blue dark:text-sky-blue font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN AUTH-SWITCH COMPONENT
   
   Desktop: classic sliding-overlay dual-panel layout.
   - Both Sign In + Sign Up forms always rendered.
   - A gradient panel slides LEFT↔RIGHT using `x` 
     transform (NOT `left`), which Framer Motion can
     GPU-accelerate smoothly via CSS transform.
   - isSignIn=true  → overlay covers RIGHT (0% → 100%)
   - isSignIn=false → overlay covers LEFT  (100% → 0%)
   
   Mobile: tab switcher with AnimatePresence form swap.
   
   Theme: all colors use dark: variants so the theme
   toggle in Navbar applies correctly.
──────────────────────────────────────────────────────── */
export const Component = ({ initialMode = "signin" }: { initialMode?: Mode }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const toggle = () => setMode((m) => (m === "signin" ? "signup" : "signin"));
  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud-white dark:bg-nebula-deep transition-colors duration-500 bg-grain">
      {/* Ambient background blobs — theme-aware */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-powder-blue/30 dark:bg-sky-blue/6 blur-[120px] -top-40 -right-40"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-sky-blue/20 dark:bg-steel-blue/8 blur-[100px] -bottom-40 -left-40"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full bg-mist-blue/25 dark:bg-powder-blue/5 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* ── Card Shell ── */}
      <div className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl shadow-2xl overflow-hidden
        bg-white/70 dark:bg-nebula-dark/80
        border border-white/60 dark:border-white/7
        backdrop-blur-2xl
        shadow-deep-navy/10 dark:shadow-black/50">

        {/* ════════════════════════════════════
            MOBILE LAYOUT  (<lg)
        ════════════════════════════════════ */}
        <div className="lg:hidden p-7">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-steel-blue/12 dark:bg-sky-blue/15 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#5C7AEA" fillOpacity="0.9" />
                <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill="#5C7AEA" fillOpacity="0.35" />
              </svg>
            </div>
            <span className="font-display font-semibold text-xs tracking-widest uppercase text-deep-navy/70 dark:text-white/70">
              Velora Auth
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 rounded-xl bg-deep-navy/5 dark:bg-white/5 mb-6 relative">
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-white/12 shadow-sm"
              animate={{ left: isSignIn ? "4px" : "calc(50%)", width: "calc(50% - 4px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-colors duration-200",
                  mode === m ? "text-deep-navy dark:text-white" : "text-deep-navy/35 dark:text-white/35"
                )}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isSignIn ? (
              <SignInForm key="si-mobile" onSwitch={toggle} />
            ) : (
              <SignUpForm key="su-mobile" onSwitch={toggle} />
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════
            DESKTOP LAYOUT  (lg+)
            Sliding overlay approach — both
            form panels are always mounted.
        ════════════════════════════════════ */}
        <div className="hidden lg:grid lg:grid-cols-2 min-h-[600px] relative overflow-hidden">

          {/* Left column — Sign In */}
          <div className="flex flex-col justify-center px-12 py-12 z-10">
            <AnimatePresence mode="wait" initial={false}>
              {isSignIn ? (
                <SignInForm key="si-desk" onSwitch={toggle} />
              ) : (
                /* Hidden behind overlay — invisible spacer */
                <motion.div
                  key="si-spacer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  className="pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right column — Sign Up */}
          <div className="flex flex-col justify-center px-12 py-12 z-10">
            <AnimatePresence mode="wait" initial={false}>
              {!isSignIn ? (
                <SignUpForm key="su-desk" onSwitch={toggle} />
              ) : (
                <motion.div
                  key="su-spacer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  className="pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── Sliding gradient overlay panel ──
              Position: always left:0, width=50%.
              When Sign In → slide to the right (x=100%)  →  left form visible
              When Sign Up → stay at left (x=0%)          →  right form visible
              Using `x` (CSS transform) NOT `left` for smooth GPU animation. */}
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 z-20 flex flex-col items-center justify-center px-10 text-center"
            style={{ left: 0 }}
            animate={{ x: isSignIn ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* Gradient fill */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, #274C77 0%, #5C7AEA 45%, #8ECAE6 100%)",
              }}
            />
            {/* Decorative rings */}
            <div className="absolute w-72 h-72 rounded-full bg-white/6 -top-20 -right-20 pointer-events-none" />
            <div className="absolute w-52 h-52 rounded-full bg-white/5 -bottom-16 -left-16 pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full bg-white/8 top-1/3 right-6 pointer-events-none" />

            {/* Panel content */}
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2.5 mb-8">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.95" />
                    <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill="white" fillOpacity="0.35" />
                  </svg>
                </div>
                <span className="font-display font-semibold text-sm tracking-widest uppercase text-white/85">
                  Velora Auth
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {isSignIn ? (
                  <motion.div
                    key="panel-new"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    <h3 className="font-display font-bold text-3xl text-white leading-tight mb-3">
                      New here?
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-[220px] mx-auto">
                      Sign up and start your premium security experience with Velora Auth.
                    </p>
                    <motion.button
                      onClick={toggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-2.5 rounded-full border-2 border-white/80 text-white text-sm font-bold tracking-wide hover:bg-white hover:text-deep-navy transition-all duration-300"
                    >
                      Sign Up
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="panel-back"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    <h3 className="font-display font-bold text-3xl text-white leading-tight mb-3">
                      Welcome back
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-[220px] mx-auto">
                      Already part of Velora? Sign in to continue your secure session.
                    </p>
                    <motion.button
                      onClick={toggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-2.5 rounded-full border-2 border-white/80 text-white text-sm font-bold tracking-wide hover:bg-white hover:text-deep-navy transition-all duration-300"
                    >
                      Sign In
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {["JWT Secured", "Session Sync", "Role Access"].map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide text-white/60 border border-white/20 bg-white/8"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Component;
