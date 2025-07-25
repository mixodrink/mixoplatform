import api from 'api/api-base';

import { Drink } from 'models/models';

// Individual payment step APIs
export const checkPaymentTerminal = async () => {
  const response = await api.get('/payment/check-terminal');
  if (response.error) {
    throw new Error(response.error.message || 'Failed to check terminal');
  }
  return response.data;
};

export const startPaymentTerminal = async (authorizedAmount: number) => {
  const response = await api.post('/payment/start-terminal', { authorizedAmount });
  if (response.error) {
    throw new Error(response.error.message || 'Failed to start terminal');
  }
  return response.data;
};

export const readPaymentCard = async () => {
  const response = await api.get('/payment/read-card');
  if (response.error) {
    throw new Error(response.error.message || 'Failed to read card');
  }
  return response.data;
};

export const authorizePaymentSession = async () => {
  const response = await api.post('/payment/authorize');
  if (response.error) {
    throw new Error(response.error.message || 'Failed to authorize payment');
  }
  return response.data;
};

export const commitPaymentSession = async (sessionId: string, authorizedAmount: number) => {
  const response = await api.post('/payment/commit', { sessionId, authorizedAmount });
  if (response.error) {
    throw new Error(response.error.message || 'Failed to commit payment');
  }
  return response.data;
};

export const stopPayment = async () => {
  const response = await api.post('/payment/stop');
  if (response.error) {
    throw new Error(response.error.message || 'Failed to stop payment');
  }
  return response.data;
};

// Original full flow API (kept for backwards compatibility)
export const postPayterStart = async (drink: Drink) => {
  const response = await api.post('/payment/start', { authorizedAmount: 10 });
  if (response.error) {
    throw new Error(response.error.message || 'Payment failed');
  }
  return response.data;
};
