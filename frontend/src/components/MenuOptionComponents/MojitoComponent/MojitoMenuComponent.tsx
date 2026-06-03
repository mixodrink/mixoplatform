import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';
import PaymentComponent from 'components/PaymentComponent/PaymentComponent';

import tropicalOne from 'assets/plants/tropical-one.png';
import tropicalTwo from 'assets/plants/tropical-two.png';
import tropicalThree from 'assets/plants/tropical-three.png';
import tropicalFour from 'assets/plants/tropical-four.png';

import lemon from 'assets/soft//lemon.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

interface SectionWrapperProps {
  selected: boolean;
  slide: boolean;
}

interface TitleProps {
  $selected: boolean;
}

interface ImageSectionWrapperProps {
  animationState: number;
  top: number;
  right: number;
  deg: number;
  slide: boolean;
  isMenu: boolean;
  paymentState: boolean;
}

interface ImageProps {
  animationState: number;
  isBright: boolean;
}

interface SectionServiceNameProps {
  animatePosition: boolean;
}

interface PlantImageWrapperProps {
  animationFadeIn: number;
}

interface PlantImageProps {
  src: string;
  alt: string;
  top: number;
  right: number;
  rotate: number;
}

const MojitoMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { options, setSelectedOption } = useMenuOptionSteps();
  const { steps, goForward } = useStepProgressStore();
  const { mix, setMojitoSelection } = useDrinkSelection();
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionStart, setTransitionStart] = useState<boolean>(false);
  const [floatingImage] = useState<string>(lemon);
  const selectedStep = useStepProgressStore((s) => s.getCurrentStep());
  const isAnyOptionSelected = options.some((option) => option.selected);
  const isMojitoSelected = !!(mix.alcohol.name && mix.soft.name);

  const handleStepProgress = () => {
    setTransitionStart(true);
    setSelectedOption('mojito');
    setMojitoSelection();

    try {
      localStorage.setItem('doubleShot', 'false');
      window.dispatchEvent(new CustomEvent('doubleShotChange', { detail: false }));
    } catch (_error) {
      // ignore storage errors
    }

    setSelected(true);
    goForward(4);
  };

  const handleClose = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionStart(false);
  };
  return (
    <>
      <SectionWrapper
        onClick={
          isAnyOptionSelected || transitionStart
            ? () => { }
            : () => handleStepProgress()
        }
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
      >
        <TitleH1 $selected={selected}>Mojito</TitleH1>
        <SubTitleH2 $selected={selected}>Rum & Lime</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionStart={transitionStart}
              style={{ borderColor: '#d8c9ff' }}
            />
            <SectionServiceName animatePosition={steps[3].selected}>
              <HeaderTitle>{mix?.alcohol.name}</HeaderTitle>
              <HeaderTitle>{mix?.soft.name}</HeaderTitle>
            </SectionServiceName>
            <PlantImageWrapper animationFadeIn={selectedStep}>
              <PlantImage src={tropicalTwo} alt="" top={-3} right={6} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-8} right={6} rotate={2} />
              <PlantImage src={tropicalThree} alt="" top={-6} right={52} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-16} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>
            <PaymentComponent
              animateShow={steps[3].selected}
              variant={2}
              priceSum={(mix?.alcohol.price ?? 0) + (mix?.soft.price ?? 0)}
              paymentClose={handleClose}
            />
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper
        animationState={selectedStep}
        top={49}
        right={50}
        deg={6}
        slide={selected}
        isMenu={selectedStep === 1}
        paymentState={steps[4].selected}
      >
        <Image
          src={floatingImage}
          alt="Floating Image"
          animationState={selectedStep}
          isBright={isMojitoSelected}
        />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
}) <SectionWrapperProps>`
  width: ${(state) => (state.selected ? 96.4 : 41)}%;
  height: ${(state) => (state.selected ? 90 : 25)}%;
  background-color: #00fc7a;
  border-radius: ${(state) => (state.selected ? 4 : 3)}rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #d8c9ff;
  top: ${(state) => (state.selected ? 0 : 34.5)}%;
  right: ${(state) => (state.slide ? 1500 : state.selected ? -3 : 550)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1<TitleProps>`
  font-size: 7rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 40px;
  color: #fff;
`;

const SubTitleH2 = styled.h2<TitleProps>`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 130px;
  left: 40px;
  color: #fff;
  overflow: hidden;
`;

// Default styles for the wrapper
const ImageSectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) =>
    !['animationState', 'top', 'right', 'deg', 'slide', 'isMenu', 'paymentState'].includes(prop),
}) <ImageSectionWrapperProps>`
  position: absolute;
  top: ${(props) =>
    props.animationState === 1 ? props.top : props.animationState === 4 ? 30 : 78}%;
  right: ${(props) =>
  props.animationState === 6 ? -100 :
    props.slide
      ? props.animationState === 1 || props.paymentState
        ? 4
        : props.animationState === 4
          ? 31
          : props.right
      : props.isMenu
        ? props.right
        : 300}%;
  rotate: ${(props) => props.deg}deg;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Image styling
const Image = styled.img.withConfig({
  shouldForwardProp: (prop) => !['animationState', 'isBright'].includes(prop),
}) <ImageProps>`
  filter: ${(props) =>
    props.isBright
      ? 'brightness(1)'
      : props.animationState === 1
        ? 'brightness(1)'
        : 'brightness(0.5)'};
  width: ${(props) => (props.animationState <= 3 || props.animationState === 5 ? 120 : 300)}px;
  height: ${(props) => (props.animationState <= 3 || props.animationState === 5 ? 250 : 600)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
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
  font-size: ${(props) => (props.animatePosition ? '6rem' : '3rem')};
`;

const HeaderTitle = styled.h1<{ bottom?: number; left?: number }>`
  color: #fff;
  margin: 0;
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
  0% { background-color: #deacff; filter: blur(170px); }
  25% { background-color: #cd82ff; filter: blur(90px); }
  50% { background-color: #bf67fa; filter: blur(170px); }
  75% { background-color: #ad35fe; filter: blur(130px); }
  100% { background-color: #9e0dff; filter: blur(90px); }
`;

const BlurredCircle = styled.div`
  position: absolute;
  left: 8.5%;
  top: -18%;
  width: 800px;
  height: 800px;
  background-color: #f4b413;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  animation: ${flicker} 2s infinite alternate ease-in-out;
`;

export default MojitoMenuComponent;
