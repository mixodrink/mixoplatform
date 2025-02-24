import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ✅ Define drink selection structure with price
interface DrinkSelectionState {
  mix: {
    alcohol: { name: string | null; price: number };
    soft: { name: string | null; price: number };
  };
  soft: {
    drink: { name: string | null; price: number };
  };
  water: {
    drink: { name: string | null; price: number };
  };
  setMixSelection: (
    alcohol: { name: string; price: number },
    soft: { name: string; price: number }
  ) => void;
  setSoftSelection: (drink: { name: string; price: number }) => void;
  setWaterSelection: (drink: { name: string; price: number }) => void;
  resetSelection: () => void;
  MixIsSelected: () => boolean;
  SoftIsSelected: () => boolean;
  WaterIsSelected: () => boolean;
}

// ✅ Zustand store with local storage persistence
export const useDrinkSelection = create(
  persist<DrinkSelectionState>(
    (set, get) => ({
      mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
      soft: { drink: { name: null, price: 0 } },
      water: { drink: { name: null, price: 0 } },

      // ✅ Set mix selection (alcohol + soft drink)
      setMixSelection: (alcohol, soft) =>
        set(() => ({
          mix: { alcohol, soft },
          soft: { drink: { name: null, price: 0 } }, // Reset soft drink selection if mix is selected
          water: { drink: { name: null, price: 0 } }, // Reset water selection if mix is selected
        })),

      // ✅ Set soft drink selection
      setSoftSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } }, // Reset mix selection if soft is selected
          soft: { drink },
          water: { drink: { name: null, price: 0 } }, // Reset water selection if soft is selected
        })),

      // ✅ Set water selection
      setWaterSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } }, // Reset mix selection if water is selected
          soft: { drink: { name: null, price: 0 } }, // Reset soft selection if water is selected
          water: { drink },
        })),

      // ✅ Reset all selections
      resetSelection: () =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
        })),

      // ✅ Check mix is selected
      MixIsSelected: () => {
        const { mix } = get();
        return mix.alcohol.name !== null;
      },

      // ✅ Check if soft is selected
      SoftIsSelected: () => {
        const { soft } = get();
        return soft.drink.name !== null;
      },

      // ✅ Check if water is selected
      WaterIsSelected: () => {
        const { water } = get();
        return water.drink.name !== null;
      },
    }),
    {
      name: 'drink-selection-store', // ✅ Saves in localStorage under this key
      storage: createJSONStorage(() => localStorage), // ✅ Persists in localStorage
    }
  )
);
