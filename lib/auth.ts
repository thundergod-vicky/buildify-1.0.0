import { AuthResponse, LoginDto, RegisterDto, User } from '@/types';
import { api } from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const auth = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setToken(response.access_token);
    this.setUser(response.user);
    return response;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setToken(response.access_token);
    this.setUser(response.user);
    return response;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async getProfile(): Promise<User | null> {
    if (!this.getToken()) return null;
    try {
      const user = await api.get<User>('/users/profile');
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  },

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  },
};
