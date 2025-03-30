import { UpdateClientRequest } from '../../../backend/Client/client';
import api from '../api';

export const updateClient = async (
  id: number,
  clientData: UpdateClientRequest
) => {
  try {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
