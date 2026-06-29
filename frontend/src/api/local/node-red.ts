import api from 'api/api-base';
import { Drink } from 'models/models';

// POST /node-red/leds
export const nodeRedLedWorker = async (data: { mode: 'enable' | 'disable' }) => {
  return "";
};

// POST /node-red/service
export const nodeRedStartService = async (drink: Drink) => {
  const response = await api.post('/service/nodeRedStartService', drink);
  return response.data;
};

// POST /node-red/serving
export const nodeRedServing = async (data: { action: 'open' | 'close' }) => {
  const response = await api.post('/service/nodeRedServing', data);
  return response.data;
};
