import api from 'api/api-base';
import { DrinkModel } from 'models';

// POST /node-red/leds
export const nodeRedLedWorker = async (data) => {
  const response = await api.post('/service/nodeRedLedWorker', { mode: data.mode });
  return response.data;
};

// POST /node-red/service
export const nodeRedStartService = async (drink: DrinkModel) => {
  const response = await api.post('/service/nodeRedStartService', drink);
  return response.data;
};
