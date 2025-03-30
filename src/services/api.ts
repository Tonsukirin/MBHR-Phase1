// apiService.ts
import axios from 'axios';
import { getClientOverview as mockGetClientOverview } from '@/app/dashboard/client-management/[id]/services';
import { getAllContracts } from '@/app/dashboard/contract-management/services/mockContractServices';
import Cookies from 'universal-cookie';

// Use environment variables to toggle between real and mock APIs
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;

const cookies = new Cookies(null, { path: '/' });

const api = axios.create({
  baseURL: USE_MOCK_API ? '' : `${BASE_URL}:${PORT}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//intercepter to add auth token
api.interceptors.request.use(config => {
  const token = cookies.get('jwt_authorization');
  console.log(token);
  // const token = process.env.NEXT_PUBLIC_JWT_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//intercepter to redirect if unauthroized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wrapper to switch between mock and real API
export const getClientOverview = async (id: string) => {
  if (USE_MOCK_API) {
    return mockGetClientOverview(id);
  } else {
    const response = await api.get(`/client/${id}`);
    return response.data;
  }
};

export const getContractList = async () => {
  if (USE_MOCK_API) {
    return getAllContracts();
  } else {
    //wait for real API
    const response = await api.get(`contracts?page=1&limit=10&search=test`);
    return response.data;
  }
};

export default api;
