import api from '../api';

interface LoginCredentials {
  username: string;
  password: string;
}

export const userLogin = async (loginInfo: LoginCredentials) => {
  try {
    const response = await api.post(`/auth/login`, loginInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};
