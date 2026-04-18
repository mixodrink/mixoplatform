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
  shot: {
    drink: { name: string | null; price: number };
  };
  setMixSelection: (
    alcohol: { name: string; price: number },
    soft: { name: string; price: number }
  ) => void;
  setMojitoSelection: () => void;
  setSoftSelection: (drink: { name: string; price: number }) => void;
  setWaterSelection: (drink: { name: string; price: number }) => void;
  setShotSelection: (drink: { name: string; price: number }) => void;
  resetSelection: () => void;
  MixIsSelected: () => boolean;
  SoftMixIsSelected: () => boolean;
  SoftIsSelected: () => boolean;
  WaterIsSelected: () => boolean;
  ShotIsSelected: () => boolean;
  applyDoubleShotToCurrentMix: (enable: boolean) => void;
}

export const useDrinkSelection = create(
  persist<DrinkSelectionState>(
    (set, get) => ({
      mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
      soft: { drink: { name: null, price: 0 } },
      water: { drink: { name: null, price: 0 } },
      shot: { drink: { name: null, price: 0 } },

      setMixSelection: (alcohol, soft) =>
        set(() => {
          // if doubleShot is enabled in localStorage, add 2 to alcohol price
          let alcoholWithDouble = { ...alcohol };
          try {
            const ds = localStorage.getItem('doubleShot') === 'true';
            if (ds) {
              alcoholWithDouble = { ...alcohol, price: alcohol.price + 4 };
            }
          } catch (e) {
            // ignore storage errors
          }
          return {
            mix: { alcohol: alcoholWithDouble, soft },
            soft: { drink: { name: null, price: 0 } },
            water: { drink: { name: null, price: 0 } },
            shot: { drink: { name: null, price: 0 } },
          };
        }),

      setMojitoSelection: () =>
        set(() => ({
          mix: {
            alcohol: { name: 'Rum', price: 6 },
            soft: { name: 'Lime', price: 6 },
          },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
          shot: { drink: { name: null, price: 0 } },
        })),

      // apply or remove double shot surcharge to current selected mix alcohol price
      applyDoubleShotToCurrentMix: (enable: boolean) =>
        set((state) => {
          const current = state.mix.alcohol;
          if (!current || current.name === null) return {} as any;
          const newPrice = enable ? current.price + 2 : current.price - 2;
          return { mix: { ...state.mix, alcohol: { ...current, price: newPrice } } } as any;
        }),

      setSoftSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink },
          water: { drink: { name: null, price: 0 } },
          shot: { drink: { name: null, price: 0 } },
        })),

      setWaterSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink },
          shot: { drink: { name: null, price: 0 } },
        })),

      setShotSelection: (drink) =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
          shot: { drink },
        })),

      resetSelection: () =>
        set(() => ({
          mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
          soft: { drink: { name: null, price: 0 } },
          water: { drink: { name: null, price: 0 } },
          shot: { drink: { name: null, price: 0 } },
        })),

      MixIsSelected: () => {
        const { mix } = get();
        return mix.alcohol.name !== null;
      },

      SoftMixIsSelected: () => {
        const { mix, soft } = get();
        return (
          (mix.soft?.name !== null && mix.soft?.name !== undefined && mix.soft?.name !== '')
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

      ShotIsSelected: () => {
        const { shot } = get();
        return shot.drink.name !== null;
      },
    }),
    {
      name: 'drink-selection-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
