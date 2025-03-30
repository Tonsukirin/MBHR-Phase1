import api from '../api';

export const getAllClient = async (page: number, limit: number) => {
  try {
    const response = await api.get(`/clients?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
