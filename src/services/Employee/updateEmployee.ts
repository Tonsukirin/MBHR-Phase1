import api from '../api';
import { UpdateEmployeeRequest } from '../../../backend/employee';

interface UpdateEmployeeRequestApi
  extends Omit<UpdateEmployeeRequest, 'employee'> {
  employee: Omit<
    UpdateEmployeeRequest['employee'],
    'startDate' | 'birthDate'
  > & {
    //ISOString
    startDate: string;
    birthDate: string;
  };
}

interface UpdateEmployeeRequestPayload {
  data: UpdateEmployeeRequestApi;
}

export const updateEmployee = async (
  employeeData: UpdateEmployeeRequestPayload,
  id: number
) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
