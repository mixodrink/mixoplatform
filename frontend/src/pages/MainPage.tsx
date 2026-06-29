import React, { useEffect } from 'react';
import styled from 'styled-components';

import MixMenuComponent from 'components/MenuOptionComponents/MixComponent/MixMenuComponent';
import SoftMenuComponent from 'components/MenuOptionComponents/SoftComponent/SoftMenuComponent';
import WaterMenuComponent from 'components/MenuOptionComponents/WaterComponent/WaterMenuComponent';
import MojitoMenuComponent from 'components/MenuOptionComponents/MojitoComponent/MojitoMenuComponent';
import ShotMenuComponent from 'components/MenuOptionComponents/ShotComponent/ShotMenuComponent';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from '../store/DrinkSelectionStore';

type MenuOptionKey = 'mix' | 'mojito' | 'soft' | 'water' | 'shot';

type Slide = Record<MenuOptionKey, boolean>;

const defaultSlideState: Slide = {
  mix: false,
  mojito: false,
  soft: false,
  water: false,
  shot: false,
};

const optionToSlideOutMap: Record<MenuOptionKey, Slide> = {
  mix: { mix: false, mojito: true, soft: true, water: true, shot: true },
  mojito: { mix: true, mojito: false, soft: true, water: true, shot: true },
  soft: { mix: true, mojito: true, soft: false, water: true, shot: true },
  water: { mix: true, mojito: true, soft: true, water: false, shot: true },
  shot: { mix: true, mojito: true, soft: true, water: true, shot: false },
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
      <MojitoMenuComponent handleSetInitialState={handleSetInitialState} isSlide={slide.mojito} />
      <SoftMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide.soft}
      />
      <WaterMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide.water}
      />
      <ShotMenuComponent
        handleSetInitialState={handleSetInitialState}
        isSlide={slide.shot}
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
  position: relative;
`;

export default MainPage;
