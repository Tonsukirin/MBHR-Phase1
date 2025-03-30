import api from '../api';

export const getEmployeeById = async (id: number) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID: ${id}`);
    throw error;
  }
};
