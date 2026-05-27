import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud-white dark:bg-nebula-deep transition-colors duration-500 bg-grain px-5">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-powder-blue/25 dark:bg-steel-blue/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-sky-blue/20 dark:bg-sky-blue/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center max-w-md"
      >
        {/* Large 404 */}
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-[10rem] sm:text-[12rem] leading-none bg-gradient-to-br from-powder-blue via-sky-blue to-steel-blue dark:from-steel-blue dark:via-sky-blue dark:to-powder-blue bg-clip-text text-transparent select-none"
        >
          404
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="-mt-4"
        >
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-deep-navy dark:text-cloud-white tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-3 text-sm text-deep-navy/50 dark:text-cloud-white/40 leading-relaxed">
            The route you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link to="/login">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-steel-blue to-deep-navy dark:from-sky-blue dark:to-steel-blue dark:text-white shadow-md hover:shadow-lg hover:shadow-steel-blue/20 transition-all duration-300"
            >
              <ArrowLeft size={15} />
              Back to Login
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
