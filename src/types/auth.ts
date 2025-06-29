

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fingerprint?: string | null;
  avatar?: File | null;
}

export interface LoginRequest {
  email: string;
  password?: string | null;
  fingerprint?: string | null;
}

export interface UpdateAvatarRequest {
  avatar: File;
}

// User.ts
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

