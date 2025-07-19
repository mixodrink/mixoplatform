import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  SoftMixIsSelected: () => boolean;
  SoftIsSelected: () => boolean;
  WaterIsSelected: () => boolean;
}

export const useDrinkSelection = create(
  persist<DrinkSelectionState>(
    (set, get) => ({
      mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
      soft: { drink: { name: null, price: 0 } },
      water: { drink: { name: null, price: 0 } },

      setMixSelection: (alcohol, soft) =>
        set(() => ({
          mix: { alcohol, soft },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
        })),

      setSoftSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink },
          water: { drink: { name: null, price: 0 } },
        })),

      setWaterSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink },
        })),

      resetSelection: () =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
        })),

      MixIsSelected: () => {
        const { mix } = get();
        return mix.alcohol.name !== null;
      },

      SoftMixIsSelected: () => {
        const { mix, soft } = get();
        return (
          (mix.soft?.name !== null && mix.soft?.name !== undefined) ||
          (soft.drink?.name !== null && soft.drink?.name !== undefined)
        );
      },

      SoftIsSelected: () => {
        const { soft } = get();
        return soft.drink.name !== null;
      },

      WaterIsSelected: () => {
        const { water } = get();
        return water.drink.name !== null;
      },
    }),
    {
      name: 'drink-selection-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
