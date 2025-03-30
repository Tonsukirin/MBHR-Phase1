// mockClientService.ts
import { mockClientOverview } from '@/mock/mockData/mockClientOverview';

export const getClientOverview = async (id: string) => {
  // Simulating a delay for the mock API call
  return new Promise(resolve => {
    setTimeout(() => {
      const client = mockClientOverview.find(item => item.client.id === id);
      resolve(client);
    }, 500);
  });
};
