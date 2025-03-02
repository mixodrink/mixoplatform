import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import SoftGridComponent from 'components/OptionComponent/SoftOptionComponent/SoftGridComponent';
import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';

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

const SoftMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { setSelectedOption } = useMenuOptionSteps();
  const { steps, goForward } = useStepProgressStore();
  const { soft, SoftIsSelected } = useDrinkSelection();
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = React.useState<boolean>(false);
  const [isTransition, setIsTransition] = useState();
  const [floatingImage, setFloatingImage] = useState<string>(cola);
  const [imageSelected, setImageSelected] = useState<string>(1);

  const handleStepProgress = () => {
    setSelectedOption('soft');
    setSelected(true);
    goForward(3);
  };

  const handleSet = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionEnd(!transitionEnd);
  };

  useEffect(() => {
    const res = SoftIsSelected();
    setIsTransition(res);
  }, [soft, SoftIsSelected]);

  const obj = {
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
    const selectedDrink = Object.values(obj).filter((drink) => drink.title === soft.drink.name)[0];
    if (selectedDrink) {
      setFloatingImage(selectedDrink.image.src);
    } else {
      setFloatingImage(cola);
    }
  }, [soft]);

  useEffect(() => {
    const filterSelectedStep = steps.filter((step) => step.selected === true)[0].id;
    setImageSelected(filterSelectedStep);
  }, [steps]);

  return (
    <>
      <SectionWrapper
        onTouchStart={transitionEnd ? () => {} : () => handleStepProgress()}
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
        onTransitionStart={handleOnTransitionEnd}
      >
        <TitleH1 selected={selected}>Soda</TitleH1>
        <SubTitleH2 selected={selected}>Perfect Refreshment!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleSet}
              transitionState={transitionEnd}
              style={{ borderColor: '#d8c9ff' }}
            />
            <SoftGridComponent
              type={'soft'}
              selected={selected}
              obj={obj}
              transitionEnd={transitionEnd}
              slideIn={isTransition}
              slideOut={!isTransition}
            />
            <PlantImageWrapper animationFadeIn={imageSelected}>
              <PlantImage src={tropicalTwo} alt="" top={-3} right={6} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-8} right={6} rotate={2} />
              <PlantImage src={tropicalThree} alt="" top={-6} right={52} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-16} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper
        animationState={imageSelected}
        top={45}
        right={1.5}
        deg={6}
        slide={selected}
        isMenu={imageSelected === 1}
      >
        <Image src={floatingImage} alt="Floating Image" animationState={imageSelected} />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['selected', 'slide'].includes(prop),
})`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #5f31d4;
  border-radius: 3rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #d8c9ff;
  top: ${(state) => (state.selected ? 2 : 34.5)}%;
  right: ${(state) => (state.slide ? 1500 : 40)}px;
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

const SubTitleH2 = styled.h2`
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
const ImageSectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) =>
    !['animationState', 'top', 'deg', 'type', 'slide', 'isMenu'].includes(prop),
})`
  position: absolute;
  top: ${(props) =>
    props.animationState === 1 ? props.top : props.animationState === 4 ? 30 : 80}%;
  right: ${(props) =>
    props.slide
      ? props.animationState === 1
        ? props.right
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
  shouldForwardProp: (prop) => !['animationState', 'type'].includes(prop),
})`
  filter: ${(props) =>
    props.animationState === 1
      ? 'brightness(1)'
      : props.animationState === 3
      ? 'brightness(0.3)'
      : 'brightness(1)'};
  width: ${(props) => (props.animationState <= 3 ? 250 : 350)}px;
  height: ${(props) => (props.animationState <= 3 ? 400 : 700)}px;
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

export default SoftMenuComponent;
