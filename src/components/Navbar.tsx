import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Sun, Moon, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function getInitials(username: string): string {
  return username
    .split(/[_\s-]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('') || username[0]?.toUpperCase() || '?';
}

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-panel border-b border-white/20 dark:border-white/8 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand */}
          <Link to={isAuthenticated ? '/' : '/login'} className="flex items-center gap-2.5 group">
            <motion.span
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-xl bg-deep-navy/10 dark:bg-cloud-white/10 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill={theme === 'dark' ? '#BDE0FE' : '#274C77'} fillOpacity="0.9" />
                <path d="M8 4.5L11 6.25V9.75L8 11.5L5 9.75V6.25L8 4.5Z" fill={theme === 'dark' ? '#BDE0FE' : '#274C77'} fillOpacity="0.35" />
              </svg>
            </motion.span>
            <span className="font-display font-semibold text-sm tracking-widest uppercase text-deep-navy dark:text-cloud-white group-hover:text-steel-blue dark:group-hover:text-sky-blue transition-colors duration-200">
              Velora Auth
            </span>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={onToggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-deep-navy/60 dark:text-cloud-white/50 bg-deep-navy/5 dark:bg-cloud-white/5 hover:bg-deep-navy/10 dark:hover:bg-cloud-white/10 border border-deep-navy/8 dark:border-cloud-white/8 transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={16} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* User Avatar Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-deep-navy/5 dark:bg-cloud-white/5 border border-deep-navy/8 dark:border-cloud-white/8">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-steel-blue to-sky-blue flex items-center justify-center text-white text-[10px] font-bold">
                    {getInitials(user.username)}
                  </div>
                  <span className="text-xs font-semibold text-deep-navy dark:text-cloud-white">{user.username}</span>
                  {user.role === 'ADMIN' && (
                    <Shield size={11} className="text-steel-blue dark:text-sky-blue" />
                  )}
                </div>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-deep-navy/70 dark:text-cloud-white/60 bg-deep-navy/5 dark:bg-cloud-white/5 border border-deep-navy/8 dark:border-cloud-white/8 hover:bg-red-500/8 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-deep-navy/70 dark:text-cloud-white/60 hover:text-deep-navy dark:hover:text-cloud-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-steel-blue hover:bg-deep-navy dark:bg-sky-blue dark:text-deep-navy dark:hover:bg-powder-blue shadow-sm transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            <motion.button
              onClick={onToggleTheme}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-deep-navy/60 dark:text-cloud-white/50 bg-deep-navy/5 dark:bg-cloud-white/5 border border-deep-navy/8 dark:border-cloud-white/8"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-deep-navy dark:text-cloud-white bg-deep-navy/5 dark:bg-cloud-white/5 border border-deep-navy/8 dark:border-cloud-white/8"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[60px] left-4 right-4 z-30 glass-panel-elevated rounded-2xl p-5 border border-white/30 dark:border-white/10"
          >
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-3 border-b border-deep-navy/8 dark:border-cloud-white/8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-steel-blue to-sky-blue flex items-center justify-center text-white font-bold">
                    {getInitials(user.username)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-deep-navy dark:text-cloud-white">{user.username}</p>
                    <p className="text-xs text-deep-navy/50 dark:text-cloud-white/40">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/8 dark:bg-red-500/10 border border-red-500/15"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link to="/login" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-center text-deep-navy dark:text-cloud-white bg-deep-navy/5 dark:bg-cloud-white/5 border border-deep-navy/8 dark:border-cloud-white/8">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-center text-white bg-steel-blue hover:bg-deep-navy dark:bg-sky-blue dark:text-deep-navy">
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
