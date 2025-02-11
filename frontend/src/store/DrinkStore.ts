import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Alcohol, Soda, Water } from '../types/Drink';

export type Beverage = Alcohol | Soda | Water;

interface DrinkStore {
  drinks: Beverage[];
  setDrinks: (drinks: Beverage[]) => void;
}

const useDrinkStore = create<DrinkStore>(
  persist(
    (set) => ({
      drinks: [
        {
          type: 'alcohol',
          alcohol: ['Vodka', 'Gin', 'Rum', 'Tequila'],
        },
        {
          type: 'soda',
          soda: ['Coke', 'Pepsi', 'Dr Pepper', 'Sprite', 'Fanta'],
        },
        {
          type: 'water',
          water: ['water'],
        },
      ],
      setDrinks: (drinks) => set({ drinks }),
    }),
    { name: 'drink-store', storage: createJSONStorage(() => localStorage) }
  )
);

export default useDrinkStore;
