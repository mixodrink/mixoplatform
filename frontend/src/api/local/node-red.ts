import api from 'api/api-base';
import { Drink } from 'models/models';

// POST /node-red/leds
export const nodeRedLedWorker = async (data: { mode: 'enable' | 'disable' }) => {
  const response = await api.post('/service/nodeRedLedWorker', { mode: data.mode });
  return response.data;
};

// POST /node-red/service
export const nodeRedStartService = async (drink: Drink) => {
  const response = await api.post('/service/nodeRedStartService', drink);
  return response.data;
};
