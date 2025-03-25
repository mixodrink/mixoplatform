import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = [
  { id: number; selected: boolean },
  { id: number; selected: boolean },
  { id: number; selected: boolean },
  { id: number; selected: boolean },
  { id: number; selected: boolean }
];

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
];

interface StepProgressState {
  steps: State;
  goForward: (id: number) => void;
  goBack(id: number): void;
  setInitialState: () => void;
}

export const useStepProgressStore = create<StepProgressState>()(
  persist<StepProgressState>(
    (set) => ({
      steps: [
        { id: 1, selected: true },
        { id: 2, selected: false },
        { id: 3, selected: false },
        { id: 4, selected: false },
        { id: 5, selected: false },
      ],
      goForward: (id: number) => {
        set((state: initialState) => {
          const updatedStep = state.steps.map((step: { id: number; selected: boolean }) => {
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
        set((state: initialState) => {
          const updatedStep = state.steps.map((step: { id: number; selected: boolean }) => {
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
      getCurrentStep: (state: steps) => {
        const currentStep = state.filter((step) => step.selected);
        return currentStep[0].id;
      },
    }),
    { name: 'step-store', storage: createJSONStorage(() => localStorage) }
  )
);
