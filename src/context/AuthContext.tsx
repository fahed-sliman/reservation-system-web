import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// استيراد الواجهات
export interface LoginRequest {
  email: string;
  password?: string | null;
  fingerprint?: string | null;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fingerprint?: string | null;
  avatar?: File | null;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  username: string;
  email: string;
  password?: string;
  fingerprint: string | null;
  is_blocked: boolean;
  blocked_until: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ فقط للتهيئة الأولى (refresh)
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ فقط للتهيئة عند refresh
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!token && !!user;

  // جلب بيانات المستخدم مع error handling محسن
  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('401: Token expired');
        }
        throw new Error(`HTTP ${res.status}: Failed to fetch profile`);
      }

      const data = await res.json();
      return data.user as User;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Profile fetch error:', error.message);
        if (error.name === 'AbortError') {
          throw new Error('Network timeout');
        }
      }
      throw error;
    }
  };

  // تسجيل الدخول (بدون loading spinner)
  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password || undefined,
        fingerprint: data.fingerprint || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: AuthResponse = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || 'فشل تسجيل الدخول',
        };
      }

      if (result.token) {
        await loginWithToken(result.token);
        return { ...result, success: true };
      }

      return { success: false, message: 'لم يتم استلام التوكن' };
    } catch (error) {
      return { success: false, message: 'خطأ في الاتصال بالخادم' };
    }
  };

  // التسجيل (بدون loading spinner)
  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('password_confirmation', data.password);
      if (data.fingerprint) formData.append('fingerprint', data.fingerprint);
      if (data.avatar) formData.append('avatar', data.avatar);

      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const result: AuthResponse = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.message || 'فشل التسجيل',
        };
      }

      return result;
    } catch (error) {
      return { success: false, message: 'خطأ في الاتصال' };
    }
  };

  // تسجيل الدخول بالتوكن
  const loginWithToken = async (authToken: string): Promise<void> => {
    localStorage.setItem('token', authToken);
    setToken(authToken);

    const userProfile = await fetchUserProfile(authToken);
    if (userProfile) {
      setUser(userProfile);
    } else {
      logout();
      throw new Error('التوكن غير صالح');
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/user/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  // تحديث بيانات المستخدم (بدون loading spinner)
  const refreshUser = async () => {
    if (!token) return;
    const profile = await fetchUserProfile(token);
    if (profile) {
      setUser(profile);
    } else {
      logout();
    }
  };

  // 🚀 التهيئة المحسنة - حماية من multiple refresh
  useEffect(() => {
    const init = async () => {
      // ✅ حماية من التشغيل المتعدد
      if (isInitialized) return;

      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // ✅ تعيين التوكن فوراً قبل API call
        setToken(storedToken);
        
        try {
          const userProfile = await fetchUserProfile(storedToken);
          if (userProfile) {
            setUser(userProfile);
          } else {
            // ✅ التحقق مرة أخرى قبل الحذف
            const currentToken = localStorage.getItem('token');
            if (currentToken === storedToken) {
              console.warn('Token is invalid, removing...');
              localStorage.removeItem('token');
              setToken(null);
            }
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // ✅ لا نحذف التوكن في حالة network error
          const currentToken = localStorage.getItem('token');
          if (currentToken === storedToken) {
            // فقط إذا كان network error خطير
            if (error instanceof Error && error.message.includes('401')) {
              localStorage.removeItem('token');
              setToken(null);
            }
          }
        }
      }
      
      // ✅ إنهاء التحميل
      setIsInitialized(true);
      setIsLoading(false);
    };

    // ✅ تأخير صغير لتجنب race conditions
    const timeoutId = setTimeout(init, 50);
    return () => clearTimeout(timeoutId);
  }, [isInitialized]);

  // التحقق الدوري من التوكن (مع حماية)
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const valid = await fetchUserProfile(token);
        if (!valid) {
          console.warn('Token validation failed during periodic check');
          logout();
        }
      } catch (error) {
        // ✅ لا نسوي logout في حالة network errors
        if (error instanceof Error && error.message.includes('401')) {
          logout();
        }
      }
    }, 30 * 60 * 1000); // 30 دقيقة

    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading: !isInitialized, // ✅ فقط أثناء تهيئة التطبيق (refresh)
    login,
    register,
    loginWithToken,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};