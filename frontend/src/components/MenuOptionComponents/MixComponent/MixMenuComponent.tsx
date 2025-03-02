import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

import MixGridComponent from 'components/OptionComponent/MixOptionComponent/MixGridComponent';
import SoftGridComponent from 'components/OptionComponent/SoftOptionComponent/SoftGridComponent';
import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';

import gin from 'assets/alcohol/gin.png';
import vodka from 'assets/alcohol/vodka.png';
import whiskey from 'assets/alcohol/whiskey.png';
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

const MixMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { setSelectedOption, getSelectedOption } = useMenuOptionSteps();
  const { steps, goForward } = useStepProgressStore();
  const { mix, soft, MixIsSelected, SoftMixIsSelected } = useDrinkSelection();

  const [selected, setSelected] = useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = useState<boolean>(false);
  const [isTransition, setIsTransition] = useState();
  const [isSoftTransition, setSoftIsTransition] = useState();
  const [imageSelected, setImageSelected] = useState<string>(1);
  const [currentSelectedOption, setCurrentSelectedOption] = useState<boolean>(false);
  const [softImageSource, setSoftImageSource] = useState(cola);
  const [alcImageSource, setAlcImageSource] = useState(rum);

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
    setTransitionEnd(!transitionEnd);
  };
  useEffect(() => {
    console.log(transitionEnd);
  }, [transitionEnd]);

  useEffect(() => {
    const res = MixIsSelected();
    setIsTransition(res);
  }, [mix, MixIsSelected]);

  useEffect(() => {
    const res = SoftMixIsSelected();
    setSoftIsTransition(res);
  }, [soft, SoftMixIsSelected]);

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
      title: 'Whiskey',
      image: { src: whiskey, alt: 'whiskey' },
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
      price: 5,
    },
    lemon: {
      title: 'Lemon',
      image: { src: lemon, alt: 'Lemon' },
      price: 5,
    },
    tonic: {
      title: 'Tonic',
      image: { src: tonic, alt: 'Tonix' },
      price: 5,
    },
    orange: {
      title: 'Lima',
      image: { src: orange, alt: 'Lima' },
      price: 5,
    },
    energy: {
      title: 'Energy',
      image: { src: energy, alt: 'Energy' },
      price: 5,
    },
  };

  useEffect(() => {
    const selectedDrink = Object.values(obj2).filter((drink) => drink.title === mix.soft.name)[0];
    if (selectedDrink) {
      setSoftImageSource(selectedDrink.image.src);
    } else {
      setSoftImageSource(cola);
    }
  }, [soft]);

  useEffect(() => {
    const selectedDrink = Object.values(obj).filter((drink) => drink.title === mix.alcohol.name)[0];
    if (selectedDrink) {
      setAlcImageSource(selectedDrink.image.src);
    } else {
      setAlcImageSource(rum);
    }
  }, [mix]);

  useEffect(() => {
    const filterSelectedStep = steps.filter((step) => step.selected === true)[0].id;
    setImageSelected(filterSelectedStep);
    const res = getSelectedOption();
    setCurrentSelectedOption(res?.option === 'mix');
  }, [steps, getSelectedOption, currentSelectedOption]);

  return (
    <>
      <SectionWrapper
        onTouchStart={transitionEnd ? () => {} : () => handleStepProgress()}
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
        onTransitionStart={handleOnTransitionEnd}
      >
        <TitleH1 selected={selected}>Cocktail</TitleH1>
        <SubTitleH2>Create your Drink!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionState={transitionEnd}
              style={{ borderColor: '#ffd8c1' }}
            />
            <MixGridComponent
              selected={selected}
              obj={obj}
              transitionEnd={transitionEnd}
              slideIn={false}
              slideOut={isTransition}
            />
            <SoftGridComponent
              type={'mix'}
              selected={selected}
              obj={obj2}
              transitionEnd={transitionEnd}
              slideIn={isSoftTransition}
              slideOut={isTransition}
            />
            <PlantImageWrapper animationFadeIn={imageSelected}>
              <PlantImage src={tropicalTwo} alt="" top={3} right={4} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-2} right={2} rotate={2} />
              <PlantImage src={tropicalThree} alt="" top={0} right={55} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-10} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper>
        <ImageAlc
          src={alcImageSource}
          alt="Floating Image"
          animationBright={imageSelected}
          animationSelected={selected}
          animationSlide={isSlide}
          type={currentSelectedOption}
        />
      </ImageSectionWrapper>
      <ImageSectionWrapper animationState={imageSelected}>
        <ImageSoft
          src={softImageSource}
          alt="Floating Image"
          animationBright={imageSelected}
          animationSelected={selected}
          animationSlide={isSlide}
          type={currentSelectedOption}
        />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
})`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #fd660e;
  border-radius: 3rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #ffc09b;
  top: 40px;
  left: ${(state) => (state.slide ? 1500 : 43)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 40px;
  color: #fff;
`;

const SubTitleH2 = styled.h2<{ selected: string }>`
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

// Default styles for the wrapper
const ImageSectionWrapper = styled.section`
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Image styling
const ImageSoft = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['animationBright', 'animationSelected', 'animationSlide', 'type'].includes(prop),
})`
  position: absolute;
  top: ${(state) =>
    state.animationBright === 1
      ? 18
      : state.animationBright === 2 || state.animationBright === 3
      ? !state.type
        ? 18
        : 83
      : 47}%;
  right: ${(state) =>
    state.animationBright === 4 && state.animationSelected
      ? 47
      : state.type || state.animationBright === 1
      ? 16
      : -100}%;
  filter: ${(state) =>
    state.animationBright === 1 || state.animationBright === 4
      ? 'brightness(1)'
      : 'brightness(0.5)'};
  rotate: -9deg;
  width: ${(state) => (state.animationBright <= 3 ? 190 : 270)}px;
  height: ${(state) => (state.animationBright <= 3 ? 300 : 520)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Image styling
const ImageAlc = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['animationBright', 'animationSelected', 'animationSlide', 'type'].includes(prop),
})`
  position: absolute;
  top: ${(state) =>
    state.animationBright === 1
      ? 4.5
      : state.animationBright === 2 || state.animationBright === 3
      ? !state.type
        ? 4.5
        : 70
      : 24}%;
  right: ${(state) =>
    state.animationBright === 4 && state.animationSelected
      ? 25
      : state.type || state.animationBright === 1
      ? 1
      : -100}%;
  filter: ${(state) =>
    state.animationBright === 1 || state.animationBright === 3 || state.animationBright === 4
      ? 'brightness(1)'
      : 'brightness(0.5)'};
  rotate: 9deg;
  width: ${(state) => (state.animationBright <= 3 ? 200 : 340)}px;
  height: ${(state) => (state.animationBright <= 3 ? 550 : 950)}px;
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

const PlantImageWrapper = styled.section<{ animationFadeIn: boolean }>`
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

const PlantImage = styled.img<{ top: number; right: number; rotate: number }>`
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

export default MixMenuComponent;
