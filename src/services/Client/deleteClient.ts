import api from '../api';

export const deleteClient = async (clientId: number) => {
  try {
    const response = await api.delete(`/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
