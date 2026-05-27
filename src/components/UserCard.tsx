import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Shield, Mail, User, Calendar } from 'lucide-react';
import type { UserProfile } from '../services/authService';

interface UserCardProps {
  user: UserProfile;
}

const GRADIENT_PAIRS: [string, string][] = [
  ['#5C7AEA', '#8ECAE6'],
  ['#274C77', '#A9D6E5'],
  ['#3A55C4', '#BDE0FE'],
  ['#1B263B', '#5C7AEA'],
  ['#274C77', '#5C7AEA'],
];

function getInitials(username: string): string {
  return username
    .split(/[_\s-]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('') || username[0]?.toUpperCase() || '?';
}

function getGradientForUser(username: string): [string, string] {
  const index = username.charCodeAt(0) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[index];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-deep-navy/6 dark:border-cloud-white/6 last:border-0">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-steel-blue/8 dark:bg-sky-blue/8 flex items-center justify-center text-steel-blue/70 dark:text-sky-blue/70">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-deep-navy/40 dark:text-cloud-white/35">{label}</p>
      <p className="text-sm font-medium text-deep-navy dark:text-cloud-white truncate">{value}</p>
    </div>
  </div>
);

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const [from, to] = getGradientForUser(user.username);
  const initials = getInitials(user.username);

  const handleCopy = async () => {
    const text = `Username: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="glass-panel-elevated rounded-2xl overflow-hidden">
        {/* Card Header Strip */}
        <div
          className="h-24 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${from}22, ${to}44)` }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${to}60, transparent 70%)`,
            }}
          />
        </div>

        {/* Avatar + Actions Row */}
        <div className="px-6 pb-2 -mt-10 flex items-end justify-between">
          {/* Initials Avatar */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center font-display font-bold text-2xl text-white select-none"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            {initials}
          </motion.div>

          {/* Copy Details Button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mb-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-steel-blue dark:text-sky-blue bg-steel-blue/8 dark:bg-sky-blue/8 border border-steel-blue/15 dark:border-sky-blue/15 hover:bg-steel-blue/15 dark:hover:bg-sky-blue/15 transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check size={13} />
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy size={13} />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Name & Role Badge */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-3">
          <div>
            <h3 className="font-display font-bold text-xl text-deep-navy dark:text-cloud-white tracking-tight">
              {user.username}
            </h3>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
              user.role === 'ADMIN'
                ? 'bg-steel-blue/15 text-steel-blue dark:bg-sky-blue/15 dark:text-sky-blue'
                : 'bg-soft-cyan/30 text-deep-navy/70 dark:bg-soft-cyan/10 dark:text-sky-blue/80'
            }`}
          >
            <Shield size={9} strokeWidth={2.5} />
            {user.role}
          </span>
        </div>

        {/* Info Rows */}
        <div className="px-6 pb-6 mt-3">
          <InfoRow icon={<User size={15} />} label="Username" value={user.username} />
          <InfoRow icon={<Mail size={15} />} label="Email" value={user.email} />
          <InfoRow icon={<Shield size={15} />} label="Role" value={user.role} />
          {user.createdAt && (
            <InfoRow icon={<Calendar size={15} />} label="Member Since" value={formatDate(user.createdAt)} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
