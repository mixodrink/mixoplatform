import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';
import WaterOptionComponent from 'components/OptionComponent/WaterOptionComponent/WaterOptionComponent';

import waterImage from 'assets/soft/water.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

const WaterMenuComponent: React.FC = ({ isSlide, handleSetInitialState }: Props) => {
  const { options, setSelectedOption } = useMenuOptionSteps();
  const { goForward } = useStepProgressStore();
  const { water, WaterIsSelected, setWaterSelection } = useDrinkSelection();
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = React.useState<boolean>(false);
  const [isTransition, setIsTransition] = useState();

  const handleStepProgress = () => {
    setSelectedOption('water');
    setWaterSelection({ name: 'Water', image: { src: waterImage, alt: 'water' }, price: 5 });
    setSelected(true);
    goForward(4);
  };

  const handleClose = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionEnd(!transitionEnd);
  };

  useEffect(() => {
    const res = WaterIsSelected();
    if (options[0].selected || options[1].selected) {
      setIsTransition(true);
    } else {
      setIsTransition(res);
    }
  }, [options, water, WaterIsSelected]);

  return (
    <>
      <SectionWrapper
        onTouchStart={transitionEnd ? () => {} : () => handleStepProgress()}
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
        onTransitionStart={handleOnTransitionEnd}
      >
        <TitleH1 selected={selected}>Water</TitleH1>
        <SubTitleH2 selected={selected}>Super Fresh!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionState={transitionEnd}
              style={{ borderColor: '#c3eeff' }}
            />
          </>
        )}
      </SectionWrapper>
      <WaterOptionComponent animationSlideIn={selected} animationSlideOut={isTransition} />
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
})`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #40c2f6;
  border-radius: 3rem;
  position: absolute;
  bottom: 40px;
  border: 20px solid #b3e9ff;
  left: ${(state) => (state.slide ? 300 : 4)}%;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  color: #fff;
  position: absolute;
  top: 20px;
  left: 40px;
`;

const SubTitleH2 = styled.h2`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  color: #fff;
  margin: 0;
  position: absolute;
  top: 145px;
  left: 40px;
  overflow: hidden;
`;

export default WaterMenuComponent;
