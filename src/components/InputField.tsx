import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`w-full flex flex-col mb-5 text-left ${className}`}>
      {/* Label with floating-like visual spacing */}
      <label 
        htmlFor={inputId}
        className={`mb-1.5 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${
          error 
            ? 'text-red-500/80 dark:text-red-400/80' 
            : isFocused 
              ? 'text-steel-blue dark:text-sky-blue' 
              : 'text-deep-navy/60 dark:text-cloud-white/50'
        }`}
      >
        {label}
      </label>

      {/* Input container with frosted visual wrapper */}
      <div className="relative w-full flex items-center">
        {/* Left Side Icon */}
        {Icon && (
          <div className={`absolute left-3.5 transition-colors duration-300 pointer-events-none z-10 ${
            error 
              ? 'text-red-500/60 dark:text-red-400/60' 
              : isFocused 
                ? 'text-steel-blue dark:text-sky-blue' 
                : 'text-deep-navy/40 dark:text-cloud-white/30'
          }`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-11 py-2 rounded-xl text-sm font-medium tracking-wide text-deep-navy dark:text-cloud-white transition-all duration-300 ${
            Icon ? 'pl-11' : 'pl-4'
          } ${
            isPassword ? 'pr-11' : 'pr-4'
          } ${
            error 
              ? 'bg-red-500/5 dark:bg-red-500/10 border border-red-500/50 dark:border-red-500/40 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)] focus:outline-none' 
              : 'glass-input'
          }`}
          {...props}
        />

        {/* Password Visibility Toggle Eye */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 flex items-center justify-center p-1 rounded-lg text-deep-navy/40 hover:text-deep-navy/70 dark:text-cloud-white/30 dark:hover:text-cloud-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 z-10"
          >
            {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
          </button>
        )}
      </div>

      {/* Validation Error Message with smooth entry */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-semibold text-red-500 dark:text-red-400 tracking-wide"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;
