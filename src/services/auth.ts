import axiosInstance from '@/utils/axiosInstance';

export interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    username: string;
    role: string;
  }
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const res = await axiosInstance.post('/auth/login', credentials);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/user/logout');
};
