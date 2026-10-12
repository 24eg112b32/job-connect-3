import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  phone?: string | null;
  created_at?: string;
  is_active?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone?: string;
    role: 'job_seeker' | 'recruiter';
  }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isSeeker: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jobconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jobconnect_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('jobconnect_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
        localStorage.setItem('jobconnect_user', JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      console.warn('Session expired or invalid, logging out.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Login failed');
    }

    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('jobconnect_token', newToken);
    localStorage.setItem('jobconnect_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const register = async (data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone?: string;
    role: 'job_seeker' | 'recruiter';
  }): Promise<User> => {
    const res = await api.post('/auth/register', data);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Registration failed');
    }

    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('jobconnect_token', newToken);
    localStorage.setItem('jobconnect_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('jobconnect_token');
    localStorage.removeItem('jobconnect_user');
    setToken(null);
    setUser(null);
    api.post('/auth/logout').catch(() => {});
  };

  const isAuthenticated = !!user && !!token;
  const isSeeker = user?.role === 'job_seeker';
  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated,
        isSeeker,
        isRecruiter,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
