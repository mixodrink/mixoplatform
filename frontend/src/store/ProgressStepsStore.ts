import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Step = { id: number; selected: boolean };
type State = Step[];

const initialState: State = [
  // Menu
  { id: 1, selected: true },
  // Alcohol
  { id: 2, selected: false },
  // Soft
  { id: 3, selected: false },
  //Payment
  { id: 4, selected: false },
  //Drink Animation
  { id: 5, selected: false },
  //Service Animation
  { id: 6, selected: false },
];

interface StepProgressState {
  steps: State;
  goForward: (id: number) => void;
  goBack(id: number): void;
  setInitialState: () => void;
  getCurrentStep(): number;
}

export const useStepProgressStore = create<StepProgressState>()(
  persist<StepProgressState>(
    (set, get) => ({
      steps: [
        { id: 1, selected: true },
        { id: 2, selected: false },
        { id: 3, selected: false },
        { id: 4, selected: false },
        { id: 5, selected: false },
        { id: 6, selected: false },
      ],
      goForward: (id: number) => {
        set((state: StepProgressState) => {
          const updatedStep = state.steps.map((step: Step) => {
            if (step.id === id) {
              return { ...step, selected: true };
            } else {
              return { ...step, selected: false };
            }
          });

          return {
            steps: updatedStep,
          };
        });
      },
      goBack: (id: number) => {
        set((state: StepProgressState) => {
          const updatedStep = state.steps.map((step: Step) => {
            if (step.id === id) {
              return { ...step, selected: !step.selected };
            } else {
              return { ...step, selected: false };
            }
          });

          return {
            steps: updatedStep,
          };
        });
      },
      setInitialState: () =>
        set(() => ({
          steps: initialState,
        })),
      getCurrentStep: (): number => {
        const found = get().steps.find((step) => step.selected);
        return found?.id ?? 1;
      },
    }),
    { name: 'step-store', storage: createJSONStorage(() => localStorage) }
  )
);
