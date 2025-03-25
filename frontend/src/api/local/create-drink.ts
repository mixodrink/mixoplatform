// src/services/drinkService.ts

import api from 'api/api-base';
import { DrinkModel } from 'models';

// POST /api/drinks
export const createDrink = async (drink: DrinkModel) => {
  const response = await api.post('/drinks', drink);
  return response.data.data.drink;
};
