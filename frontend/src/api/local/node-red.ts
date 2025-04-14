import api from 'api/api-base';
import { DrinkModel } from 'models';

// POST /node-red/leds
export const connectNodeRed = async (drink: DrinkModel) => {
  const response = await api.post('/service/nodeRed', drink);
  return response.data;
};
