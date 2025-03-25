import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MenuOption {
  option: string;
  selected: boolean;
}

interface MenuOptionsState {
  options: MenuOption[];
  getSelectedOption: () => MenuOption | undefined;
  setSelectedOption: (option: string) => void;
  setMenuInitialState: () => void;
}

export const useMenuOptionSteps = create<MenuOptionsState>()(
  persist(
    (set, get) => ({
      options: [
        { option: 'mix', selected: false },
        { option: 'soft', selected: false },
        { option: 'water', selected: false },
      ],
      setSelectedOption: (option: string) => {
        set((state) => ({
          options: state.options.map((item) =>
            item.option === option ? { ...item, selected: true } : { ...item, selected: false }
          ),
        }));
      },
      getSelectedOption: () => {
        return get().options.find((item) => item.selected);
      },
      setMenuInitialState: () =>
        set(() => ({
          options: [
            { option: 'mix', selected: false },
            { option: 'soft', selected: false },
            { option: 'water', selected: false },
          ],
        })),
    }),
    { name: 'option-store', storage: createJSONStorage(() => localStorage) }
  )
);
