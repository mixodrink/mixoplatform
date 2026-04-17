import api from 'api/api-base';

interface NodeRedServicePayload {
  type: string;
  drink: string[];
}

// POST /node-red/leds
export const nodeRedLedWorker = async (data: { mode: 'enable' | 'disable' }) => {
  return "";
};

// POST /node-red/service
export const nodeRedStartService = async (drink: NodeRedServicePayload) => {
  const response = await api.post('/service/nodeRedStartService', drink);
  return response.data;
};
