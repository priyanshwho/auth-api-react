import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenient custom React hook for accessing the global Authentication Context.
 * Throws an error if used outside an AuthProvider wrapper.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be consumed within a valid AuthProvider wrapper.');
  }
  return context;
};
