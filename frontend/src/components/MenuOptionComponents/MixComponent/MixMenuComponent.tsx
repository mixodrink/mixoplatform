import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

import MixGridComponent from 'components/GridServiceComponent/MixGridComponent/MixGridComponent';
import SoftGridComponent from 'components/GridServiceComponent/SoftGridComponent/SoftGridComponent';
import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';
import PaymentComponent from 'components/PaymentComponent/PaymentComponent';
import StepControlButtonComponent from 'components/ButtonComponents/StepControlButtonComponent';

import gin from 'assets/alcohol/gin.png';
import vodka from 'assets/alcohol/vodka.png';
import whiskey from 'assets/alcohol/whiskey.png';
import Tequila from 'assets/alcohol/tequila.png';
import rum from 'assets/alcohol/rum.png';
import cola from 'assets/soft/cola.png';
import lemon from 'assets/soft//lemon.png';
import tonic from 'assets/soft/tonic.png';
import orange from 'assets/soft/orange.png';
import energy from 'assets/soft/energy.png';

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
  onTransitionEnd?: () => void;
  onTransitionStart?: () => void;
}

interface TitleH1Props {
  selected: boolean;
}

interface SubTitleH2Props {
  selected: boolean;
}

interface ImageProps {
  currentStep: number;
  animationSelected: boolean;
  animationSlide: boolean;
  isBright: boolean;
  type: boolean;
}

interface PlantImageProps {
  top: number;
  right: number;
  rotate: number;
}

interface PlantImageWrapperProps {
  animationFadeIn: number;
}

interface SectionServiceNameProps {
  animatePosition: boolean;
}
const obj = {
  gin: {
    title: 'Gin',
    image: { src: gin, alt: 'gin' },
    price: 6,
  },
  vodka: {
    title: 'Vodka',
    image: { src: vodka, alt: 'vodka' },
    price: 6,
  },
  whiskey: {
    title: 'Tequila',
    image: { src: Tequila, alt: 'Tequila' },
    price: 6,
  },
  rum: {
    title: 'Rum',
    image: { src: rum, alt: 'rum' },
    price: 6,
  },
};

const obj2 = {
  cola: {
    title: 'Cola',
    image: { src: cola, alt: 'cola' },
    price: 6,
  },
  lemon: {
    title: 'Lemon',
    image: { src: lemon, alt: 'Lemon' },
    price: 6,
  },
  tonic: {
    title: 'Tonic',
    image: { src: tonic, alt: 'Tonix' },
    price: 6,
  },
  orange: {
    title: 'Lime',
    image: { src: orange, alt: 'Lime' },
    price: 6,
  },
  energy: {
    title: 'Energy',
    image: { src: energy, alt: 'Energy' },
    price: 7,
  },
};

const MixMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { options, setSelectedOption, getSelectedOption } = useMenuOptionSteps();
  const { steps, goForward, getCurrentStep } = useStepProgressStore();
  const { mix, soft, MixIsSelected, SoftMixIsSelected } = useDrinkSelection();

  const [selected, setSelected] = useState<boolean>(false);
  const [transitionStart, setTransitionStart] = useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = useState<boolean>(false);
  const [isTransition, setIsTransition] = useState<boolean>(false);
  const [isSoftTransition, setSoftIsTransition] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1 || null);
  const [currentSelectedOption, setCurrentSelectedOption] = useState<boolean>(false);
  const [softImageSource, setSoftImageSource] = useState(cola);
  const [alcImageSource, setAlcImageSource] = useState(rum);
  const [currentMixIsSelected, setCurrentMixIsSelected] = useState<boolean>(false);
  const [currentSoftIsSelected, setCurrentSoftIsSelected] = useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('mix');
    setSelected(true);
    goForward(2);
  };

  const handleClose = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionEnd(true);
    setTransitionStart(false);
  };

  const handleOnTransitionStart = () => {
    setTransitionStart(true);
    setTransitionEnd(false);
  };

  useEffect(() => {
    const res = MixIsSelected();
    setIsTransition(res);
  }, [mix, MixIsSelected]);

  useEffect(() => {
    const res = SoftMixIsSelected();
    if (steps[2].selected && res) {
      setSoftIsTransition(false);
    } else {
      setSoftIsTransition(res);
    }
  }, [steps, soft, SoftMixIsSelected]);

  useEffect(() => {
    const selectedDrink = Object.values(obj2).filter((drink) => drink.title === mix.soft.name)[0];
    if (selectedDrink) {
      setSoftImageSource(selectedDrink.image.src);
    } else {
      setSoftImageSource(cola);
    }
  }, [mix, soft]);

  useEffect(() => {
    const selectedDrink = Object.values(obj).filter((drink) => drink.title === mix.alcohol.name)[0];
    if (selectedDrink) {
      setAlcImageSource(selectedDrink.image.src);
    } else {
      setAlcImageSource(rum);
    }
  }, [mix]);

  useEffect(() => {
    const res = getSelectedOption();
    setCurrentSelectedOption(res?.option === 'mix');
  }, [steps, getSelectedOption, currentSelectedOption]);

  useEffect(() => {
    const res = MixIsSelected();
    setCurrentMixIsSelected(res);

    const res2 = SoftMixIsSelected();
    console.log('SoftMixIsSelected', res2);
    setCurrentSoftIsSelected(res2)
  }, [mix, MixIsSelected, SoftMixIsSelected]);

  const selectedStepFromStore = useStepProgressStore((s) => s.getCurrentStep());

  useEffect(() => {
    setCurrentStep(selectedStepFromStore);
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
        onTransitionStart={handleOnTransitionStart}
      >
        <TitleH1 selected={selected}>Cocktail</TitleH1>
        <SubTitleH2 selected={selected}>Create your Drink!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionStart={transitionStart}
              style={{ borderColor: '#ffd8c1' }}
            />
            <MixGridComponent
              selected={selected}
              obj={obj}
              transitionEnd={transitionEnd && steps[1].selected}
              slideIn={false}
              slideOut={isTransition}
            />
            <SoftGridComponent
              type={'mix'}
              selected={selected}
              obj={obj2}
              transitionEnd={transitionEnd && steps[2].selected}
              slideIn={isSoftTransition || false}
              slideOut={isTransition}
            />
            <SectionServiceName animatePosition={steps[3].selected}>
              <HeaderAlcohol>{mix?.alcohol.name}</HeaderAlcohol>
              <HeaderSoft>{mix?.soft.name}</HeaderSoft>
            </SectionServiceName>
            <PlantImageWrapper animationFadeIn={currentStep}>
              <PlantImage src={tropicalTwo} alt="" top={0} right={4} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-6} right={2} rotate={2} />
              <PlantImage src={tropicalThree} alt="" top={0} right={55} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-12} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>
            <PaymentComponent
              animateShow={steps[3].selected}
              variant={1}
              priceSum={mix?.alcohol.price + mix?.soft.price}
              paymentClose={handleClose}
            />
            <StepControlButtonComponent
              clickableState={transitionEnd}
              resMix={isTransition}
              resSoft={isSoftTransition}
              handleSetMixTransition={setIsTransition}
              handleSetSoftTransition={setSoftIsTransition}
              handleClose={handleClose}
              animateArrowBack={currentMixIsSelected}
              animateArrowForward={
                (steps[1].selected && currentSoftIsSelected) ||
                (steps[2].selected && currentSoftIsSelected)
              }
            />
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper
        onClick={
          options[0].selected || options[1].selected || options[2].selected || transitionStart
            ? () => { }
            : () => handleStepProgress()
        }
      >
        <ImageAlc
          src={alcImageSource}
          alt="Floating Image"
          currentStep={currentStep}
          animationSelected={selected}
          animationSlide={isSlide}
          isBright={currentMixIsSelected}
          type={currentSelectedOption}
        />
      </ImageSectionWrapper>
      <ImageSectionWrapper
        onClick={
          options[0].selected || options[1].selected || options[2].selected || transitionStart
            ? () => { }
            : () => handleStepProgress()
        }
      >
        <ImageSoft
          src={softImageSource}
          alt="Floating Image"
          currentStep={currentStep}
          animationSelected={selected}
          animationSlide={isSlide}
          isBright={currentSoftIsSelected}
          type={currentSelectedOption}
        />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
}) <SectionWrapperProps>`
  width: ${(state) => (state.selected ? 96.4 : 89)}%;
  height: ${(state) => (state.selected ? 98 : 29)}%;
  background-color: #fd660e;
  border-radius: ${(state) => (state.selected ? 4 : 3)}rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #ffc09b;
  top: ${(state) => (state.selected ? -1 : 40)}px;
  left: ${(state) => (state.slide ? 1500 : state.selected ? 2 : 43)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
}) <TitleH1Props>`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 40px;
  color: #fff;
`;

const SubTitleH2 = styled.h2.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
}) <SubTitleH2Props>`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 145px;
  left: 40px;
  color: #fff;
  overflow: hidden;
`;

const ImageSectionWrapper = styled.section`
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ImageSoft = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['currentStep', 'animationSelected', 'animationSlide', 'type', 'isBright'].includes(prop),
}) <ImageProps>`
  position: absolute;
  top: ${(state) =>
    state.currentStep === 1
      ? 18
      : state.currentStep === 2 || state.currentStep === 3 || state.currentStep === 5
        ? !state.type
          ? 18
          : 83
        : state.currentStep === 6
          ? 83
          : 42}%;
  right: ${(state) =>
    state.currentStep === 6 ? -100 :
      state.currentStep === 4 && state.animationSelected
        ? 47
        : state.type || state.currentStep === 1
          ? 16
          : 16}%;
  filter: ${(state) =>
    state.isBright
      ? 'brightness(1)'
      : state.currentStep === 1
        ? 'brightness(1)'
        : 'brightness(0.5)'};
  rotate: -9deg;
  width: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 190
      : 270}px;
  height: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 300
      : 520}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ImageAlc = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['currentStep', 'animationSelected', 'animationSlide', 'type', 'isBright'].includes(prop),
}) <ImageProps>`
  position: absolute;
  top: ${(state) =>
    state.currentStep === 1
      ? 4.5
      : state.currentStep === 2 || state.currentStep === 3 || state.currentStep === 5
        ? !state.type
          ? 4.5
          : 70
        : state.currentStep === 6
          ? 70
          : 19}%;
  right: ${(state) =>
    state.currentStep === 6 ? -100 :
      state.currentStep === 4 && state.animationSelected
        ? 25
        : state.type || state.currentStep === 1
          ? 1
          : 1}%;
  filter: ${(state) =>
    state.isBright
      ? 'brightness(1)'
      : state.currentStep === 1
        ? 'brightness(1)'
        : 'brightness(0.5)'};
  rotate: 9deg;
  width: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 200
      : 340}px;
  height: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 550
      : 950}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
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
  0% { background-color: #f4b413; filter: blur(170px); }
  25% { background-color: #fcb449; filter: blur(90px); }
  50% { background-color: #ffb700; filter: blur(170px); }
  75% { background-color: #e69c00; filter: blur(130px); }
  100% { background-color: #f4a213; filter: blur(90px); }
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

const SectionServiceName = styled.section.withConfig({
  shouldForwardProp: (prop) => !['animatePosition'].includes(prop),
}) <SectionServiceNameProps>`
  position: absolute;
  bottom: ${(props) => (props.animatePosition ? 19.5 : 5)}%;
  left: ${(props) => (props.animatePosition ? 40 : 25)}%;
  width: 21%;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  transition: 1s ease-in-out;
  font-size: ${(props) => (props.animatePosition ? '7rem' : '4.3rem')};
`;

const HeaderAlcohol = styled.h1<{ bottom?: number; left?: number }>`
  color: #fff;
  margin: 0;
`;

const HeaderSoft = styled.h1<{ bottom?: number; left?: number }>`
  color: #fff;
  margin: 0;
`;

export default MixMenuComponent;
