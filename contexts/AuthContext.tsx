'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, LoginDto, RegisterDto, AuthResponse } from '@/types';
import { auth as authService } from '@/lib/auth';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  updateProfile: (data: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();
      
      if (token) {
        if (storedUser) setUser(storedUser); // Show stored user immediately
        connectSocket(token);
        
        // Fetch fresh profile in background
        try {
          const freshUser = await authService.getProfile();
          if (freshUser) {
            setUser(freshUser);
            authService.setUser(freshUser); // Persist full profile
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
          if (!storedUser) authService.logout(); // Invalid token?
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response: AuthResponse = await authService.login(credentials);
      setUser(response.user);
      connectSocket(response.access_token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response: AuthResponse = await authService.register(data);
      setUser(response.user);
      connectSocket(response.access_token);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User> & { password?: string }) => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/users/profile`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authService.getToken()}`
              },
              body: JSON.stringify(data)
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to update profile');
          }

          const updatedUser = await response.json();
          setUser(updatedUser);
          // Update local storage if needed, or authService.setUser
          // authService.setUser(updatedUser); // If setUser exists or manual
      } catch (error) {
          throw error;
      }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    disconnectSocket();
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
