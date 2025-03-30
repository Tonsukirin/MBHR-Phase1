import api from '../api';

export const deleteEmployee = async (id: number) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
