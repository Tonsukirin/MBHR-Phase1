import api from '../../api';

export const deleteContactPerson = async (clientId: number, index: number) => {
  try {
    const response = await api.delete(
      `/clients/${clientId}/contactPerson/${index}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
