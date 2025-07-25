import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';
import WaterOptionComponent from 'components/GridServiceComponent/WaterItemComponent/WaterItemComponent';
import PaymentComponent from 'components/PaymentComponent/PaymentComponent';

import waterImage from 'assets/soft/water.png';

import tropicalOne from 'assets/plants/tropical-one.png';
import tropicalTwo from 'assets/plants/tropical-two.png';
import tropicalThree from 'assets/plants/tropical-three.png';
import tropicalFour from 'assets/plants/tropical-four.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

interface SectionWrapperProps {
  selected: boolean;
  slide: boolean;
}

interface TitleProps {
  selected: boolean;
}

interface PlantImageWrapperProps {
  animationFadeIn: number;
}

interface PlantImageProps {
  top: number;
  right: number;
  rotate: number;
}

interface SectionServiceNameProps {
  animatePosition: boolean;
}

const WaterMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { options, setSelectedOption } = useMenuOptionSteps();
  const { steps, goForward, getCurrentStep } = useStepProgressStore();
  const { water, WaterIsSelected, setWaterSelection } = useDrinkSelection();
  const [selectedStep, setSelectedStep] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = React.useState<boolean>(false);
  const [transitionStart, setTransitionStart] = useState<boolean>(false);
  const [isTransition, setIsTransition] = useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('water');
    setWaterSelection({ name: 'Water', price: 5 });
    setSelected(true);
    goForward(4);
  };

  const handleClose = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionEnd(true);
    setTransitionStart(false);
  };

  useEffect(() => {
    const res = WaterIsSelected();
    if (options[0].selected || options[1].selected) {
      setIsTransition(true);
    } else {
      setIsTransition(res);
    }
  }, [options, water, WaterIsSelected]);

  const selectedStepFromStore = useStepProgressStore((s) => s.getCurrentStep());

  useEffect(() => {
    setSelectedStep(selectedStepFromStore);
  }, [selectedStepFromStore]);

  return (
    <>
      <SectionWrapper
        onClick={
          options[0].selected || options[1].selected || options[2].selected || transitionStart
            ? () => { }
            : () => handleStepProgress()
        }
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
      >
        <TitleH1 selected={selected}>Water</TitleH1>
        <SubTitleH2 selected={selected}>Super Fresh!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionStart={transitionStart}
              style={{ borderColor: '#c3eeff' }}
            />
            <SectionServiceName animatePosition={steps?.[3]?.selected || false}>
              <HeaderTitle>{water.drink.name}</HeaderTitle>
            </SectionServiceName>
            <PlantImageWrapper animationFadeIn={selectedStep}>
              <PlantImage src={tropicalTwo} alt="" top={-3} right={6} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-10} right={6} rotate={11} />
              <PlantImage src={tropicalThree} alt="" top={-6} right={52} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-16} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>
            <PaymentComponent
              animateShow={steps?.[3]?.selected || false}
              variant={3}
              priceSum={water?.drink.price}
              paymentClose={handleClose}
            />
          </>
        )}
      </SectionWrapper>
      <WaterOptionComponent
        animationSlideIn={selected}
        animationSlideOut={isTransition}
        animationBackSlideOut={steps?.[4]?.selected || false}
      />
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
}) <SectionWrapperProps>`
  width: ${(state) => (state.selected ? 96.4 : 89)}%;
  height: ${(state) => (state.selected ? 98 : 29)}%;
  background-color: #40c2f6;
  border-radius: ${(state) => (state.selected ? 4 : 3)}rem;
  position: absolute;
  bottom: ${(state) => (state.selected ? 0 : 40)}px;
  border: 20px solid #b3e9ff;
  left: ${(state) => (state.slide ? 300 : state.selected ? 0.3 : 4)}%;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1<TitleProps>`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  color: #fff;
  position: absolute;
  top: 20px;
  left: 40px;
`;

const SubTitleH2 = styled.h2<TitleProps>`
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

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
`;

const PlantImageWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['animationFadeIn'].includes(prop),
}) <PlantImageWrapperProps>`
  position: absolute;
  top: 47%;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  display: ${(props) => (props.animationFadeIn === 4 ? 'block' : 'none')};
  transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  ${({ animationFadeIn }) =>
    animationFadeIn === 4 &&
    css`
      animation: 2s ${fadeIn} 0.5s forwards;
    `}
`;

const rotate = keyframes`
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100%{
    transform: rotate(-10deg);
  }
`;

const PlantImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !['top', 'right', 'rotate'].includes(prop),
}) <PlantImageProps>`
  position: absolute;
  top: ${(props) => props.top}%;
  right: ${(props) => props.right}%;
  rotate: ${(props) => props.rotate}deg;
  width: 400px;
  height: 400px;
  animation: ${rotate} 2s ease-in-out infinite;
`;

const flicker = keyframes`
  0% { background-color: #acd4ff; filter: blur(170px); }
  25% { background-color: #96c9ff; filter: blur(90px); }
  50% { background-color: #82beff; filter: blur(170px); }
  75% { background-color: #4aa1ff; filter: blur(130px); }
  100% { background-color: #2c92ff; filter: blur(90px); }
`;

const BlurredCircle = styled.div`
  position: absolute;
  left: 8.5%;
  top: -18%;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  animation: ${flicker} 2s infinite alternate ease-in-out;
`;

const SectionServiceName = styled.section.withConfig({
  shouldForwardProp: (prop) => !['animatePosition'].includes(prop),
}) <SectionServiceNameProps>`
  position: absolute;
  bottom: ${(props) => (props.animatePosition ? 21 : 5)}%;
  left: ${(props) => (props.animatePosition ? 40 : 13.5)}%;
  width: 21%;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  transition: 1s ease-in-out;
`;

const HeaderTitle = styled.h1<{ bottom?: number; left?: number }>`
  font-size: 6rem;
  color: #fff;
  margin: 0;
`;

export default WaterMenuComponent;
