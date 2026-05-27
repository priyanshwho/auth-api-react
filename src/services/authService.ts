import axios from 'axios';

// Base URL for the FreeAPI service
const API_BASE_URL = 'https://api.freeapi.app/api/v1';

// Create a custom Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Storage Helpers
 * Intelligently reads/writes to localStorage or sessionStorage based on user session preferences
 */
export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem('velora_token') || sessionStorage.getItem('velora_token');
  },
  
  setToken: (token: string, remember: boolean = true) => {
    if (remember) {
      localStorage.setItem('velora_token', token);
    } else {
      sessionStorage.setItem('velora_token', token);
    }
  },
  
  getUser: (): any | null => {
    const userStr = localStorage.getItem('velora_user') || sessionStorage.getItem('velora_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  setUser: (user: any, remember: boolean = true) => {
    const userStr = JSON.stringify(user);
    if (remember) {
      localStorage.setItem('velora_user', userStr);
    } else {
      sessionStorage.setItem('velora_user', userStr);
    }
  },
  
  clear: () => {
    localStorage.removeItem('velora_token');
    localStorage.removeItem('velora_user');
    sessionStorage.removeItem('velora_token');
    sessionStorage.removeItem('velora_user');
  }
};

// Add request interceptor to automatically attach JWT token on all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define type definitions for FreeAPI responses to ensure strong typing
export interface FreeApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar?: {
    url: string;
    localPath: string;
  };
}

export interface LoginResult {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

// Authentication API calls
export const authService = {
  /**
   * Registers a new user.
   */
  register: async (username: string, email: string, password: string, role: 'USER' | 'ADMIN' = 'USER') => {
    const response = await apiClient.post<FreeApiResponse<{ user: UserProfile }>>('/users/register', {
      username,
      email,
      password,
      role,
    });
    return response.data;
  },

  /**
   * Log in a user using username OR email and password.
   */
  login: async (usernameOrEmail: string, password: string, remember: boolean = true) => {
    const isEmail = usernameOrEmail.includes('@');
    const payload: any = { password };
    
    if (isEmail) {
      payload.email = usernameOrEmail;
    } else {
      payload.username = usernameOrEmail;
    }

    const response = await apiClient.post<FreeApiResponse<LoginResult>>('/users/login', payload);
    
    if (response.data.success && response.data.data) {
      const { accessToken, user } = response.data.data;
      storage.setToken(accessToken, remember);
      storage.setUser(user, remember);
    }
    
    return response.data;
  },

  /**
   * Log out the current user, clearing local credentials.
   */
  logout: async () => {
    try {
      // Send logout request to FreeAPI to invalidate token on server
      await apiClient.post<FreeApiResponse<any>>('/users/logout');
    } catch (err) {
      console.warn('Backend logout failed or token was already expired:', err);
    } finally {
      // Always clear local storage even if the API call fails
      storage.clear();
    }
  },

  /**
   * Fetch current authenticated user's profile details.
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<FreeApiResponse<UserProfile>>('/users/current-user');
    
    // Auto-update stored user profile details to ensure syncing
    if (response.data.success && response.data.data) {
      const activeUser = response.data.data;
      const isPersistent = !!localStorage.getItem('velora_token');
      storage.setUser(activeUser, isPersistent);
    }
    
    return response.data;
  },
};
