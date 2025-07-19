import api from 'api/api-base';

import { Drink } from 'models/models';

// POST /payment/payter
export const postPayterStart = async (drink: Drink) => {
  const response = await api.post('/payment/start', { authorizedAmount: 10 });
  return response.data;
};
