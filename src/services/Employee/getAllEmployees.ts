import api from '../api';

export const getAllEmployees = async (
  page: number,
  limit: number,
  status?: string,
  position?: string
) => {
  try {
    const response = await api.get(
      `/employees?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ''
      }${position ? `&position=${position}` : ''}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
