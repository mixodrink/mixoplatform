import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DrinkOption {
  alc?: string | null;
  soft: string;
  type: string;
  price: string;
}

interface DrinkOptionState {
  drink: DrinkOption;
  getSelectedDrink: () => DrinkOption | undefined;
  setSelectedDrink: (drink: DrinkOption) => void;
  setDrinkInitialState: () => void;
}

export const useDrinkSelection = create<DrinkOptionState>()(
  persist(
    (set, get) => ({
      drink: { alc: '', soft: '', type: '', price: '' }, // ✅ Fix initial state

      // ✅ Set selected drink
      setSelectedDrink: (option: DrinkOption) => {
        set(() => ({ drink: option })); // ✅ Updates state with selected drink
      },

      // ✅ Get selected drink (returns the current drink state)
      getSelectedDrink: () => {
        return get().drink;
      },

      // ✅ Reset drink state
      setDrinkInitialState: () =>
        set(() => ({
          drink: { alc: '', soft: '', type: '', price: '' },
        })),
    }),
    { name: 'drink-selection-store', storage: createJSONStorage(() => localStorage) }
  )
);
