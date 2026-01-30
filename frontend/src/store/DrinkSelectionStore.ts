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
  applyDoubleShotToCurrentMix: (enable: boolean) => void;
}

export const useDrinkSelection = create(
  persist<DrinkSelectionState>(
    (set, get) => ({
      mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
      soft: { drink: { name: null, price: 0 } },
      water: { drink: { name: null, price: 0 } },

      setMixSelection: (alcohol, soft) =>
        set(() => {
          // if doubleShot is enabled in localStorage, add 2 to alcohol price
          let alcoholWithDouble = { ...alcohol };
          try {
            const ds = localStorage.getItem('doubleShot') === 'true';
            if (ds) {
              alcoholWithDouble = { ...alcohol, price: alcohol.price + 2 };
            }
          } catch (e) {
            // ignore storage errors
          }
          return {
            mix: { alcohol: alcoholWithDouble, soft },
            soft: { drink: { name: null, price: 0 } },
            water: { drink: { name: null, price: 0 } },
          };
        }),

      // apply or remove double shot surcharge to current selected mix alcohol price
      applyDoubleShotToCurrentMix: (enable: boolean) =>
        set((state) => {
          const current = state.mix.alcohol;
          // Only apply if we have a valid mix with alcohol selected
          if (!current || current.name === null || current.name === '') return state;
          
          // Additional safeguard: verify we actually have a mix (both alcohol and soft)
          const hasMix = state.mix.alcohol.name && state.mix.soft.name;
          if (!hasMix) {
            // If no mix is selected, clear doubleShot from storage
            try {
              localStorage.removeItem('doubleShot');
            } catch (e) {
              // ignore
            }
            return state;
          }
          
          const newPrice = enable ? current.price + 2 : current.price - 2;
          return { mix: { ...state.mix, alcohol: { ...current, price: newPrice } } } as any;
        }),

      setSoftSelection: (drink) =>
        set(() => {
          // Clear doubleShot when selecting non-mix drink
          try {
            localStorage.removeItem('doubleShot');
            window.dispatchEvent(new CustomEvent('doubleShotChange', { detail: false }));
          } catch (e) {
            // ignore storage errors
          }
          return {
            mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
            soft: { drink },
            water: { drink: { name: null, price: 0 } },
          };
        }),

      setWaterSelection: (drink) =>
        set(() => {
          // Clear doubleShot when selecting non-mix drink
          try {
            localStorage.removeItem('doubleShot');
            window.dispatchEvent(new CustomEvent('doubleShotChange', { detail: false }));
          } catch (e) {
            // ignore storage errors
          }
          return {
            mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
            soft: { drink: { name: null, price: 0 } },
            water: { drink },
          };
        }),

      resetSelection: () =>
        set(() => {
          // Always clear doubleShot when resetting selection
          try {
            localStorage.removeItem('doubleShot');
            window.dispatchEvent(new CustomEvent('doubleShotChange', { detail: false }));
          } catch (e) {
            // ignore storage errors
          }
          return {
            mix: { alcohol: { name: null, price: 0 }, soft: { name: null, price: 0 } },
            soft: { drink: { name: null, price: 0 } },
            water: { drink: { name: null, price: 0 } },
          };
        }),

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
    }),
    {
      name: 'drink-selection-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
