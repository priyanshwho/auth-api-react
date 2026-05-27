import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  label = "Securing session...", 
  fullscreen = true 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 bg-grain">
      {/* Premium Backing Glow Mesh */}
      <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-sky-blue/30 to-steel-blue/20 blur-3xl animate-pulse-slow pointer-events-none z-0" />

      {/* Orbit Spinner */}
      <div className="relative flex items-center justify-center w-24 h-24 z-10">
        {/* Outer Ring */}
        <motion.div 
          className="absolute w-20 h-20 border-2 border-transparent border-t-steel-blue border-r-steel-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring (Counter-rotating) */}
        <motion.div 
          className="absolute w-14 h-14 border-2 border-transparent border-b-sky-blue border-l-sky-blue rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Pulsing Spark */}
        <motion.div 
          className="w-4 h-4 rounded-full bg-gradient-to-tr from-steel-blue to-sky-blue shadow-lg shadow-steel-blue/30"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Brand & Loading text */}
      <motion.div 
        className="mt-6 text-center z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display font-semibold text-lg tracking-wider text-deep-navy dark:text-cloud-white">
          VELORA <span className="font-light text-steel-blue dark:text-powder-blue">AUTH</span>
        </h2>
        <p className="mt-2 text-xs font-medium tracking-wide text-deep-navy/50 dark:text-cloud-white/40">
          {label}
        </p>
      </motion.div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cloud-white/80 dark:bg-nebula-deep/95 backdrop-blur-md transition-colors duration-500">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full py-12">
      {content}
    </div>
  );
};

export default Loader;
