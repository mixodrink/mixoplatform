import React, { useEffect } from 'react';
import styled from 'styled-components';

import MixMenuComponent from 'components/MenuOptionComponents/MixComponent/MixMenuComponent';
import SoftMenuComponent from 'components/MenuOptionComponents/SoftComponent/SoftMenuComponent';
import WaterMenuComponent from 'components/MenuOptionComponents/WaterComponent/WaterMenuComponent';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from '../store/DrinkSelectionStore';

import logoShoko from 'assets/custom/logo-shoko.png';

type MenuOptionKey = 'mix' | 'soft' | 'water';

type Slide = Record<MenuOptionKey, boolean>;

const defaultSlideState: Slide = {
  mix: false,
  soft: false,
  water: false,
};

const optionToSlideOutMap: Record<MenuOptionKey, Slide> = {
  mix: { mix: false, soft: true, water: true },
  soft: { mix: true, soft: false, water: true },
  water: { mix: true, soft: true, water: false },
};

const MainPage: React.FC = () => {
  const { options, getSelectedOption, setMenuInitialState } = useMenuOptionSteps();
  const { setInitialState } = useStepProgressStore();
  const { resetSelection } = useDrinkSelection();
  const [slide, setSlide] = React.useState<Slide>(defaultSlideState);

  useEffect(() => {
    const res = getSelectedOption();
    if (!res) {
      setSlide(defaultSlideState);
      return;
    }

    if (res.option in optionToSlideOutMap) {
      const selectedOption = res.option as MenuOptionKey;
      setSlide(optionToSlideOutMap[selectedOption]);
    }
  }, [options, getSelectedOption]);

  useEffect(() => {
    setSlide(defaultSlideState);
  }, []);

  const handleSetInitialState = () => {
    setSlide(defaultSlideState);
    setInitialState();
    setMenuInitialState();
    resetSelection();
  };

  useEffect(() => {
    resetSelection();
  }, [resetSelection]);

  return (
    <SectionGlobalWrapper>
      <MixMenuComponent handleSetInitialState={handleSetInitialState} isSlide={slide.mix} />
      <SoftMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide.soft}
      />
      <WaterMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide.water}
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
  height: 100%;
`;

export default MainPage;
