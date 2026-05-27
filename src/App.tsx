import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Component as AuthSwitch } from './components/ui/auth-switch';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Inner component that reads location for AnimatePresence
const AppRoutes: React.FC<{ theme: 'light' | 'dark'; onToggleTheme: () => void }> = ({
  theme,
  onToggleTheme,
}) => {
  const location = useLocation();

  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Redirect root to dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <AuthSwitch initialMode="signin" />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <AuthSwitch initialMode="signup" />
              </PageTransition>
            }
          />
          <Route
            path="/404"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  // Theme management: persisted to localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('velora_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply/remove .dark class on document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('velora_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes theme={theme} onToggleTheme={toggleTheme} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '13px',
              fontWeight: '500',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;