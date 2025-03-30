import api from '../api';
import { CreateEmployeeRequest } from '../../../backend/employee';

interface CreateEmployeeRequestApi
  extends Omit<CreateEmployeeRequest, 'employee'> {
  employee: Omit<
    CreateEmployeeRequest['employee'],
    'startDate' | 'birthDate'
  > & {
    //ISOString
    startDate: string;
    birthDate: string;
  };
}

export const createEmployee = async (
  employeeData: CreateEmployeeRequestApi
) => {
  try {
    const response = await api.post(`/employees`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
