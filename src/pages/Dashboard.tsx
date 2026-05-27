import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserCard from '../components/UserCard';

function getGreeting(username: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${username}`;
  if (hour < 17) return `Good afternoon, ${username}`;
  return `Good evening, ${username}`;
}

function formatSessionTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const SESSION_DURATION = 30 * 60; // 30 minutes in seconds

const Dashboard: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [rawData, setRawData] = useState<any>(null);
  const [rawVisible, setRawVisible] = useState(false);
  const [rawCopied, setRawCopied] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(SESSION_DURATION);

  // Load raw data alongside user
  useEffect(() => {
    if (user) {
      setRawData(user);
    }
  }, [user]);

  // Session countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on user activity
    const resetTimer = () => setSessionSeconds(SESSION_DURATION);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
    setSessionSeconds(SESSION_DURATION);
  }, [refreshUser]);

  const handleCopyRaw = async () => {
    await navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
    setRawCopied(true);
    setTimeout(() => setRawCopied(false), 2000);
  };

  const sessionPercent = (sessionSeconds / SESSION_DURATION) * 100;
  const sessionWarning = sessionSeconds < 5 * 60;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cloud-white dark:bg-nebula-deep transition-colors duration-500 bg-grain pt-20 pb-10">
      {/* Background gradient decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-powder-blue/20 dark:bg-steel-blue/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-blue/15 dark:bg-deep-navy/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-steel-blue dark:text-sky-blue mb-1">
              Dashboard
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-deep-navy dark:text-cloud-white tracking-tight">
              {getGreeting(user.username)} 👋
            </h1>
            <p className="mt-1.5 text-sm text-deep-navy/50 dark:text-cloud-white/40">
              Your session is active and secured.
            </p>
          </div>

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-steel-blue dark:text-sky-blue bg-steel-blue/8 dark:bg-sky-blue/8 border border-steel-blue/15 dark:border-sky-blue/15 hover:bg-steel-blue/15 dark:hover:bg-sky-blue/15 disabled:opacity-50 transition-all duration-200"
          >
            <motion.span
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw size={14} />
            </motion.span>
            {refreshing ? 'Syncing...' : 'Refresh Profile'}
          </motion.button>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: UserCard */}
          <div className="lg:col-span-2">
            <UserCard user={user} />
          </div>

          {/* Right Column: Session Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-elevated rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-steel-blue dark:text-sky-blue" />
              <h3 className="font-semibold text-sm text-deep-navy dark:text-cloud-white">Session Timer</h3>
            </div>

            {/* Countdown */}
            <div className="text-center my-4">
              <p
                className={`font-display font-bold text-4xl tracking-tight transition-colors duration-300 ${
                  sessionWarning ? 'text-red-500 dark:text-red-400' : 'text-deep-navy dark:text-cloud-white'
                }`}
              >
                {formatSessionTime(sessionSeconds)}
              </p>
              <p className="mt-1 text-xs text-deep-navy/40 dark:text-cloud-white/35">remaining in session</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-deep-navy/8 dark:bg-cloud-white/8 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors duration-500 ${
                  sessionWarning
                    ? 'bg-gradient-to-r from-red-500 to-orange-400'
                    : 'bg-gradient-to-r from-steel-blue to-sky-blue'
                }`}
                style={{ width: `${sessionPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {sessionWarning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-[11px] text-center font-semibold text-red-500 dark:text-red-400"
              >
                ⚠️ Session expiring soon
              </motion.p>
            )}

            <div className="mt-auto pt-6">
              <p className="text-[11px] text-center text-deep-navy/35 dark:text-cloud-white/25 leading-relaxed">
                Activity automatically extends your session up to 30 minutes of inactivity.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Raw JSON Inspector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 glass-panel-elevated rounded-2xl overflow-hidden"
        >
          {/* Inspector Header */}
          <button
            onClick={() => setRawVisible(!rawVisible)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-deep-navy/2 dark:hover:bg-cloud-white/2 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <span className="text-xs font-mono font-semibold text-deep-navy/60 dark:text-cloud-white/50">
                GET /api/v1/users/current-user
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10">
                200 OK
              </span>
            </div>
            <div className="flex items-center gap-2">
              {rawData && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopyRaw(); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-deep-navy/50 dark:text-cloud-white/40 hover:bg-deep-navy/5 dark:hover:bg-cloud-white/5 transition-colors"
                >
                  {rawCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {rawCopied ? 'Copied' : 'Copy'}
                </button>
              )}
              {rawVisible ? (
                <ChevronUp size={16} className="text-deep-navy/40 dark:text-cloud-white/35" />
              ) : (
                <ChevronDown size={16} className="text-deep-navy/40 dark:text-cloud-white/35" />
              )}
            </div>
          </button>

          {/* Collapsible JSON Body */}
          <motion.div
            initial={false}
            animate={{ height: rawVisible ? 'auto' : 0, opacity: rawVisible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-deep-navy/6 dark:border-cloud-white/6">
              <pre className="mt-4 p-4 rounded-xl bg-deep-navy/4 dark:bg-nebula-deep/60 text-xs font-mono text-deep-navy/75 dark:text-cloud-white/70 overflow-x-auto leading-relaxed max-h-64 overflow-y-auto">
                {rawData ? JSON.stringify(rawData, null, 2) : 'No data loaded.'}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
