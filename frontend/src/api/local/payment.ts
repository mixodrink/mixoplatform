import api from 'api/api-base';

import { DrinkModel } from 'models/models';

// POST /payment/payter
export const postPayterStart = async (drink: DrinkModel) => {
  const response = await api.post('/payment/start', { authorizedAmount: 10 });
  return response.data;
};
