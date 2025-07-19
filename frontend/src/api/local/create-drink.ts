import api from 'api/api-base';
import { Drink } from 'models/models';

export const createDrink = async (drink: Drink) => {
  const response = await api.post('/service/createService', drink);
  return response.data;
};