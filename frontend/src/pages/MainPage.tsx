import React, { useEffect } from 'react';
import styled from 'styled-components';

import MixMenuComponent from 'components/MenuOptionComponents/MixComponent/MixMenuComponent';
import SoftMenuComponent from 'components/MenuOptionComponents/SoftComponent/SoftMenuComponent';
import WaterMenuComponent from 'components/MenuOptionComponents/WaterComponent/WaterMenuComponent';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from '../store/DrinkSelectionStore';

type Slide = [
  { id: number; selected: boolean },
  { id: number; selected: boolean },
  { id: number; selected: boolean }
];

const MainPage: React.FC = () => {
  const { options, getSelectedOption, setMenuInitialState } = useMenuOptionSteps();
  const { setInitialState } = useStepProgressStore();
  const { resetSelection } = useDrinkSelection();
  const [slide, setSlide] = React.useState<Slide>([
    { id: 1, selected: false },
    { id: 2, selected: false },
    { id: 3, selected: false },
  ]);

  useEffect(() => {
    const res = getSelectedOption();
    if (res) {
      if (res.option === 'mix') {
        setSlide([
          { id: 1, selected: false },
          { id: 2, selected: true },
          { id: 3, selected: true },
        ]);
      } else if (res.option === 'soft') {
        setSlide([
          { id: 1, selected: true },
          { id: 2, selected: false },
          { id: 3, selected: true },
        ]);
      } else if (res.option === 'water') {
        setSlide([
          { id: 1, selected: true },
          { id: 2, selected: true },
          { id: 3, selected: false },
        ]);
      }
    }
  }, [options]);

  useEffect(() => {
    setSlide([
      { id: 1, selected: false },
      { id: 2, selected: false },
      { id: 3, selected: false },
    ]);
  }, []);

  const handleSetInitialState = () => {
    setSlide([
      { id: 1, selected: false },
      { id: 2, selected: false },
      { id: 3, selected: false },
    ]);
    setInitialState();
    setMenuInitialState();
    resetSelection();
  };

  useEffect(() => {
    resetSelection();
  }, [resetSelection]);

  return (
    <SectionGlobalWrapper>
      <MixMenuComponent handleSetInitialState={handleSetInitialState} isSlide={slide[0].selected} />
      <SoftMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide[1].selected}
      />
      <WaterMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide[2].selected}
      />
    </SectionGlobalWrapper>
  );
};

const SectionGlobalWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
  height: 95%;
`;

export default MainPage;
