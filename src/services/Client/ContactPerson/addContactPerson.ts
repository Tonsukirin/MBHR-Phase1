import { ClientContactPersonBase } from '../../../../backend/Client/contactPerson';
import api from '../../api';

export const addContactPerson = async (
  clientId: number,
  contactPersonData: ClientContactPersonBase
) => {
  try {
    const response = await api.post(
      `/clients/${clientId}/contactPerson`,
      contactPersonData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
