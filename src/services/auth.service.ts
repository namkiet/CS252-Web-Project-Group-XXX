// Định nghĩa các kiểu dữ liệu (Interfaces) để code an toàn hơn
export interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}

interface SignupResponse {
  message: string;
  token: string;
  user: { id: string; email: string };
  require_email_confirm: boolean;
}

interface ErrorResponse {
  error: string;
}

const API_URL = '/auth';

export const authService = {
  
  // LOGIN
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Đăng nhập thất bại');
      }

      // Store Token and User into LocalStorage
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data as LoginResponse;
    } catch (error) {
      throw error;
    }
  },

  // SIGN UP
  signup: async (email: string, password: string, fullName: string): Promise<SignupResponse> => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: fullName 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Đăng ký thất bại');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
           localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data as SignupResponse;
    } catch (error) {
      throw error;
    }
  },

  // LOG OUT
  logout: async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error("Lỗi khi gọi API logout:", err);
        }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};