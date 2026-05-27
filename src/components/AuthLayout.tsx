import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading: string;
  heroTitle?: string;
  heroSubtitle?: string;
  footerText?: string;
  footerLinkLabel?: string;
  footerLinkTo?: string;
}

const FloatingBlob: React.FC<{ className: string; delay?: number }> = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{
      x: [0, 40, -30, 20, 0],
      y: [0, -50, 30, -20, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    }}
    transition={{
      duration: 22,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
);

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heading,
  subheading,
  heroTitle = 'A new standard\nof security.',
  heroSubtitle = 'Seamless. Elegant. Trusted.',
  footerText,
  footerLinkLabel,
  footerLinkTo,
}) => {
  return (
    <div className="min-h-screen w-full flex bg-cloud-white dark:bg-nebula-deep transition-colors duration-500 bg-grain">
      {/* ─── LEFT HERO PANEL (Desktop Only) ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-10 xl:p-14">
        {/* Layered Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-powder-blue via-sky-blue to-soft-cyan dark:from-nebula-dark dark:via-nebula-deep dark:to-deep-navy transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/10 to-transparent" />

        {/* Floating Gradient Blobs */}
        <FloatingBlob className="w-96 h-96 bg-steel-blue/20 dark:bg-steel-blue/10 -top-24 -right-24" delay={0} />
        <FloatingBlob className="w-80 h-80 bg-ice-blue/50 dark:bg-ice-blue/10 bottom-10 -left-20" delay={3} />
        <FloatingBlob className="w-64 h-64 bg-powder-blue/60 dark:bg-powder-blue/10 top-1/2 right-10" delay={7} />

        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(39,76,119,1) 1px, transparent 1px), linear-gradient(90deg, rgba(39,76,119,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Brand Logo / Name */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-deep-navy/15 dark:bg-cloud-white/15 backdrop-blur-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
                <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill="white" fillOpacity="0.4" />
              </svg>
            </span>
            <span className="font-display font-semibold text-base text-deep-navy/80 dark:text-cloud-white/80 tracking-widest uppercase">
              Velora Auth
            </span>
          </span>
        </div>

        {/* Hero Typography */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-5xl xl:text-6xl leading-[1.1] tracking-tight text-deep-navy dark:text-cloud-white whitespace-pre-line"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-sm font-medium tracking-[0.25em] uppercase text-deep-navy/50 dark:text-cloud-white/40"
          >
            {heroSubtitle}
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="mt-8 w-20 h-[2px] bg-gradient-to-r from-deep-navy/30 to-transparent dark:from-cloud-white/30 rounded-full"
          />

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {['JWT Secured', 'Role-based Access', 'Session Persistence'].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide text-deep-navy/70 dark:text-cloud-white/60 bg-deep-navy/8 dark:bg-cloud-white/8 border border-deep-navy/10 dark:border-cloud-white/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-steel-blue dark:bg-sky-blue" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom Attribution */}
        <div className="relative z-10">
          <p className="text-[11px] text-deep-navy/35 dark:text-cloud-white/25 tracking-wide">
            Powered by FreeAPI · Built with React + Vite
          </p>
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-10 relative overflow-hidden">
        {/* Subtle Background Blobs for form side */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-powder-blue/25 dark:bg-steel-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-sky-blue/20 dark:bg-sky-blue/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Logo (only shown on small screens) */}
        <div className="lg:hidden mb-8 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-steel-blue/15 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#274C77" fillOpacity="0.9" />
              <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill="#274C77" fillOpacity="0.35" />
            </svg>
          </span>
          <span className="font-display font-semibold text-base text-deep-navy dark:text-cloud-white tracking-widest uppercase">
            Velora Auth
          </span>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass-panel-elevated rounded-2xl p-8 sm:p-10">
            {/* Card Header */}
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-deep-navy dark:text-cloud-white tracking-tight">
                {heading}
              </h2>
              <p className="mt-2 text-sm text-deep-navy/55 dark:text-cloud-white/45 leading-relaxed">
                {subheading}
              </p>
            </div>

            {/* Form Content */}
            {children}

            {/* Footer Link */}
            {footerText && footerLinkLabel && footerLinkTo && (
              <p className="mt-6 text-center text-sm text-deep-navy/50 dark:text-cloud-white/40">
                {footerText}{' '}
                <Link
                  to={footerLinkTo}
                  className="font-semibold text-steel-blue dark:text-sky-blue hover:text-deep-navy dark:hover:text-powder-blue transition-colors duration-200 underline underline-offset-2"
                >
                  {footerLinkLabel}
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
