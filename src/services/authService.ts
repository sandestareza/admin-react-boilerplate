// import { api } from "@/lib/api";

// Define strict types for the service
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock data for simulation
const MOCK_USER: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://github.com/shadcn.png'
};

const MOCK_TOKEN = 'mock-token-12345-' + Date.now();

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic mock validation
    if (credentials.email === 'error@example.com') {
      throw new Error('Invalid credentials');
    }

    // In a real app, this would be:
    // const response = await api.post<AuthResponse>('/auth/login', credentials);
    // return response.data;

    return {
      user: { ...MOCK_USER, email: credentials.email },
      token: MOCK_TOKEN,
    };
  },

  async register(data: any): Promise<AuthResponse> {
    console.log({data});
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        user: MOCK_USER,
        token: MOCK_TOKEN
    }
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
     await new Promise((resolve) => setTimeout(resolve, 500));
     // const response = await api.get<User>('/auth/me');
     // return response.data;
     return MOCK_USER;
  }
};
