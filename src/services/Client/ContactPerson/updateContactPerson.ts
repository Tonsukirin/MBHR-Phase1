import { ClientContactPersonBase } from '../../../../backend/Client/contactPerson';
import api from '../../api';

export const updateContactPerson = async (
  clientId: number,
  contactPersonData: ClientContactPersonBase,
  index: number
) => {
  try {
    const response = await api.put(
      `/clients/${clientId}/contactPerson/${index}`,
      contactPersonData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
