import { CreateClientRequest } from '../../../backend/Client/client';
import api from '../api';

export const addClient = async (clientData: CreateClientRequest) => {
  try {
    const response = await api.post(`/clients/`, clientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
