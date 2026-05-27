import { createContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { authService, storage } from '../services/authService';
import type { UserProfile } from '../services/authService';
import toast from 'react-hot-toast';

// Type definitions for Auth Context values
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string, remember: boolean) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'USER' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create Context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user and token on mount (Automatic Session Persistence)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.getToken();
      const cachedUser = storage.getUser();

      if (!token) {
        setLoading(false);
        return;
      }

      // If we have a token, attempt to verify and fetch fresh profile details
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUserState(response.data);
        } else {
          // If response isn't successful, clear storage
          storage.clear();
          setUserState(null);
        }
      } catch (error: any) {
        console.error('Failed to verify token:', error);
        
        // Premium UX: Offline resilience. 
        // If it's a network error (no response), fallback to local cache instead of kicking them out!
        if (!error.response && cachedUser) {
          setUserState(cachedUser);
          toast.success('Restored session from cache (Offline Mode)', {
            icon: '📶',
            duration: 4000
          });
        } else {
          // If it's an API error (e.g. 401 Unauthorized), the session is invalid
          storage.clear();
          setUserState(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in user
   */
  const login = async (usernameOrEmail: string, password: string, remember: boolean) => {
    setLoading(true);
    try {
      const response = await authService.login(usernameOrEmail, password, remember);
      if (response.success && response.data) {
        setUserState(response.data.user);
        toast.success(`Welcome back, ${response.data.user.username}!`, {
          style: {
            borderRadius: '12px',
            background: '#F7FBFF',
            color: '#274C77',
            border: '1px solid #BDE0FE',
          },
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please verify your credentials.';
      toast.error(errorMsg, {
        style: {
          borderRadius: '12px',
          background: '#FFF5F5',
          color: '#C53030',
          border: '1px solid #FEB2B2',
        },
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user
   */
  const register = async (username: string, email: string, password: string, role: 'USER' | 'ADMIN') => {
    setLoading(true);
    try {
      const response = await authService.register(username, email, password, role);
      if (response.success) {
        toast.success('Registration successful! Please login.', {
          style: {
            borderRadius: '12px',
            background: '#F7FBFF',
            color: '#274C77',
            border: '1px solid #BDE0FE',
          },
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please check input parameters.';
      toast.error(errorMsg, {
        style: {
          borderRadius: '12px',
          background: '#FFF5F5',
          color: '#C53030',
          border: '1px solid #FEB2B2',
        },
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    const loadingToast = toast.loading('Logging you out safely...');
    try {
      await authService.logout();
      setUserState(null);
      toast.success('Logged out successfully.', {
        id: loadingToast,
        style: {
          borderRadius: '12px',
          background: '#F7FBFF',
          color: '#274C77',
          border: '1px solid #BDE0FE',
        },
      });
    } catch (error) {
      setUserState(null);
      toast.dismiss(loadingToast);
    }
  };

  /**
   * Manually refreshes user details from the server
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUserState(response.data);
      }
    } catch (error) {
      console.error('Failed to sync profile details:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
