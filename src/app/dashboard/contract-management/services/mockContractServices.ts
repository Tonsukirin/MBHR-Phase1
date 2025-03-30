import { mockContractList } from '@/mock/mockData/mockContractList';

export const getAllContracts = async () => {
  // Simulating a delay for the mock API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockContractList);
    }, 500);
  });
};
