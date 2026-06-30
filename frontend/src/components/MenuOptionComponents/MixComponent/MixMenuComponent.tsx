import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useMenuOptionSteps } from "store/MenuOptionStore";
import { useStepProgressStore } from "store/ProgressStepsStore";
import { useDrinkSelection } from "store/DrinkSelectionStore";

import CocktailGridComponent from "components/GridServiceComponent/CocktailGridComponent/CocktailGridComponent";
import CloseButtonComponent from "components/ButtonComponents/CloseButtonComponent";
import PaymentComponent from "components/PaymentComponent/PaymentComponent";
import PlaceYourGlassComponent from "components/PaymentComponent/PlaceYourGlassComponent";
import { nodeRedServing } from "api/local/node-red";

import cocktailVerde from "assets/cocktails/cocktail-verde.png";
import cocktailNaranja from "assets/cocktails/cocktail-naranja.png";
import cocktailRojo from "assets/cocktails/cocktail-rojo.png";
import cocktailAmarillo from "assets/cocktails/cocktail-amarillo.png";
import tropicalOne from "assets/plants/tropical-one.png";
import tropicalTwo from "assets/plants/tropical-two.png";
import tropicalThree from "assets/plants/tropical-three.png";
import tropicalFour from "assets/plants/tropical-four.png";

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

interface SectionServiceNameProps {
  animatePosition: boolean;
}

const cocktails = {
  mojito: { name: 'Mojito', image: cocktailVerde, price: 12 },
  pornstar: { name: 'Pornstar', image: cocktailNaranja, price: 12 },
  redsky: { name: 'Red Sky', image: cocktailRojo, price: 12 },
  paloma: { name: 'Paloma', image: cocktailAmarillo, price: 12 }
};

const MixMenuComponent: React.FC<Props> = ({
  isSlide,
  handleSetInitialState,
}) => {
  const { options, setSelectedOption, getSelectedOption } =
    useMenuOptionSteps();
  const { steps, goForward, getCurrentStep } = useStepProgressStore();
  const { cocktail, CocktailIsSelected } = useDrinkSelection();

  const [selected, setSelected] = useState<boolean>(false);
  const [transitionStart, setTransitionStart] = useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1 || null);
  const [currentSelectedOption, setCurrentSelectedOption] =
    useState<boolean>(false);
  const [showGlassScreen, setShowGlassScreen] = useState<boolean>(false);
  const [cocktailImageSource, setCocktailImageSource] = useState(cocktailRojo);
  const [hideImages, setHideImages] = useState<boolean>(false);

  const isAnyOptionSelected = options.some((option) => option.selected);

  const handleStepProgress = () => {
    setSelectedOption("mix");
    setSelected(true);
    goForward(2);
  };

  const handleClose = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleContinue = () => {
    nodeRedServing({ action: 'close' }).catch((error) => {
      console.error('Error closing serving:', error);
    });
    goForward(4);
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
    const selectedCocktail = Object.values(cocktails).find(
      (c) => c.name === cocktail.name
    );
    if (selectedCocktail) {
      setCocktailImageSource(selectedCocktail.image);
    }
  }, [cocktail]);

  useEffect(() => {
    const res = getSelectedOption();
    setCurrentSelectedOption(res?.option === "mix");
  }, [steps, getSelectedOption, currentSelectedOption]);

  const selectedStepFromStore = useStepProgressStore((s) => s.getCurrentStep());

  useEffect(() => {
    setCurrentStep(selectedStepFromStore);
  }, [selectedStepFromStore]);

  useEffect(() => {
    setShowGlassScreen(steps[2].selected);
  }, [steps]);

  return (
    <>
      <SectionWrapper
        onClick={
          isAnyOptionSelected || transitionStart
            ? () => {}
            : () => handleStepProgress()
        }
        selected={selected}
        slide={isSlide}
        onTransitionEnd={handleOnTransitionEnd}
        onTransitionStart={handleOnTransitionStart}
      >
        <TitleH1 selected={selected}>Cocktail</TitleH1>
        <SubTitleH2 selected={selected}>Create your Drink</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionStart={transitionStart}
              style={{ borderColor: "#ffd8c1" }}
            />
            
            {steps[1].selected && (
              <CocktailGridComponent
                cocktails={cocktails}
                selected={selected}
                transitionEnd={transitionEnd}
              />
            )}

            {steps[2].selected && (
              <PlaceYourGlassComponent
                onContinue={handleContinue}
                onClose={handleClose}
                borderColor="#ffb3b3"
                variant={1}
              />
            )}

            {(steps[1].selected || steps[2].selected || steps[3].selected) && cocktail.name && (
              <SectionServiceName animatePosition={steps[3].selected}>
                <HeaderTitle>{cocktail.name}</HeaderTitle>
              </SectionServiceName>
            )}

            <PlantImageWrapper animationFadeIn={currentStep}>
              <PlantImage src={tropicalTwo} alt="" top={-3} right={6} rotate={25} />
              <PlantImage src={tropicalOne} alt="" top={-8} right={6} rotate={2} />
              <PlantImage src={tropicalThree} alt="" top={-6} right={52} rotate={-90} />
              <PlantImage src={tropicalFour} alt="" top={-16} right={40} rotate={-70} />
              <BlurredCircle />
            </PlantImageWrapper>

            <PaymentComponent
              animateShow={steps[3].selected}
              variant={1}
              bgColor="#fd660e"
              priceSum={cocktail.price}
              paymentClose={handleClose}
              onGlassScreenChange={setHideImages}
              skipGlassScreen={true} // Glass screen already shown in step 2
            />
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper
        animationState={selected ? currentStep : 1}
        top={13}
        right={1.5}
        deg={6}
        slide={selected}
        isMenu={currentStep === 1}
        paymentState={steps[4].selected}
        style={{ 
          opacity: hideImages ? 0 : 1, 
          pointerEvents: hideImages ? 'none' : 'auto', 
          transition: '0.4s ease'
        }}
      >
        <Image
          src={cocktailImageSource}
          alt="Cocktail Image"
          animationState={selected ? currentStep : 1}
          isBright={CocktailIsSelected()}
        />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !["selected", "slide"].includes(prop),
})<SectionWrapperProps>`
  width: ${(state) => (state.selected ? 96.4 : 89)}%;
  height: ${(state) => (state.selected ? 96.4 : 29)}%;
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
  shouldForwardProp: (prop) => !["selected"].includes(prop),
})<TitleH1Props>`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 40px;
  color: #fff;
`;

const SubTitleH2 = styled.h2.withConfig({
  shouldForwardProp: (prop) => !["selected"].includes(prop),
})<SubTitleH2Props>`
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

const ImageSectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) =>
    !["animationState", "top", "right", "deg", "slide", "isMenu", "paymentState"].includes(prop),
})<ImageSectionWrapperProps>`
  position: absolute;
  top: ${
    (props) =>
      props.animationState === 1 ? props.top : props.animationState === 4 ? 30 : props.animationState === 3 ? 30 : 78
  }%;
  right: ${
    (props) =>
      props.animationState === 6
        ? -100
        : props.slide
        ? props.animationState === 1 || props.paymentState
          ? props.right
          : props.animationState === 4
          ? 31
          : props.animationState === 3
          ? 28
          : props.right
        : props.isMenu
        ? props.right
        : 300
  }%;
  rotate: ${(props) => props.deg}deg;
  transition: 3.5s ease-in-out;
`;

const Image = styled.img.withConfig({
  shouldForwardProp: (prop) => !["animationState", "isBright"].includes(prop),
})<ImageProps>`
  filter: ${
    (props) =>
      props.isBright
        ? "brightness(1)"
        : props.animationState === 1
        ? "brightness(1)"
        : "brightness(0.5)"
  };
  width: ${(props) => (props.animationState <= 3 || props.animationState === 5 ? 240 : 320)}px;
  height: ${(props) => (props.animationState <= 3 || props.animationState === 5 ? 400 : 600)}px;
  transition: 2s cubic-bezier(0.4, 0, 0.2, 1);
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
  shouldForwardProp: (prop) => !["animationFadeIn"].includes(prop),
})<PlantImageWrapperProps>`
  position: absolute;
  top: 47%;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  display: ${(props) => (props.animationFadeIn === 4 ? "block" : "none")};
  transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  ${
    ({ animationFadeIn }) =>
      animationFadeIn === 4 &&
      css`
        animation: 3s ${fadeIn} 0.5s forwards;
      `
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(-10deg);
  }
`;

const PlantImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !["top", "right", "rotate"].includes(prop),
})<PlantImageProps>`
  position: absolute;
  top: ${(props) => props.top}%;
  right: ${(props) => props.right}%;
  rotate: ${(props) => props.rotate}deg;
  width: 400px;
  height: 400px;
  animation: ${rotate} 5s ease-in-out infinite;
`;

const flicker = keyframes`
  0% { background-color: #ff9d5c; filter: blur(170px); }
  25% { background-color: #ff8533; filter: blur(90px); }
  50% { background-color: #ff6b00; filter: blur(170px); }
  75% { background-color: #ff5500; filter: blur(130px); }
  100% { background-color: #ff4400; filter: blur(90px); }
`;

const BlurredCircle = styled.div`
  position: absolute;
  left: 8.5%;
  top: -18%;
  width: 800px;
  height: 800px;
  background-color: #ff8533;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  animation: ${flicker} 6s infinite alternate ease-in-out;
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

export default MixMenuComponent;
