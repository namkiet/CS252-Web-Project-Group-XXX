export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// The form backend response for login and signup
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

const API_URL = '/api/auth';

export const authService = {
  // LogIn
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
        throw new Error((data as ErrorResponse).error || 'Sign-in failed');
      }

      // Store Token and User into SessionStorage
      if (data.access_token) {
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      return data as LoginResponse;
    } catch (error) {
      throw error;
    }
  },

  // SignUp
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
        throw new Error((data as ErrorResponse).error || 'Sign-up failed');
      }

      if (data.token) {
        sessionStorage.setItem('token', data.token);
        if (data.user) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data as SignupResponse;
    } catch (error) {
      throw error;
    }
  },

  // LogOut
  logout: async () => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Error when call API logout:", err);
      }
    }

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Get current token
  getToken: () => {
    return sessionStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  }
};