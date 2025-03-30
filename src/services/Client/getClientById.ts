import api from '../api';

export const getClientById = async (id: number) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID: ${id}`);
    throw error;
  }
};
