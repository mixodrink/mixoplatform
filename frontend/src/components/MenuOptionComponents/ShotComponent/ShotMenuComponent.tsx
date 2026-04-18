import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

import { useMenuOptionSteps } from "store/MenuOptionStore";
import { useStepProgressStore } from "store/ProgressStepsStore";
import { useDrinkSelection } from "store/DrinkSelectionStore";

import ShotGridComponent from "components/GridServiceComponent/ShotGridComponent/ShotGridComponent";
import CloseButtonComponent from "components/ButtonComponents/CloseButtonComponent";
import PaymentComponent from "components/PaymentComponent/PaymentComponent";

import gin from "assets/alcohol/gin.png";
import vodka from "assets/alcohol/vodka.png";
import whiskey from "assets/alcohol/whiskey.png";
import Tequila from "assets/alcohol/tequila.png";
import rum from "assets/alcohol/rum.png";

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
    title: "Gin",
    image: { src: gin, alt: "gin" },
    price: 4,
  },
  vodka: {
    title: "Vodka",
    image: { src: vodka, alt: "vodka" },
    price: 4,
  },
  whiskey: {
    title: "Whisky",
    image: { src: whiskey, alt: "Whisky" },
    price: 4,
  },
  rum: {
    title: "Rum",
    image: { src: rum, alt: "rum" },
    price: 4,
  }
};

const ShotMenuComponent: React.FC<Props> = ({
  isSlide,
  handleSetInitialState,
}) => {
  const { options, setSelectedOption, getSelectedOption } =
    useMenuOptionSteps();
  const { steps, goForward, getCurrentStep } = useStepProgressStore();
  const { shot, ShotIsSelected, setShotSelection } = useDrinkSelection();

  const [selected, setSelected] = useState<boolean>(false);
  const [transitionStart, setTransitionStart] = useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = useState<boolean>(false);
  const [isTransition, setIsTransition] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1 || null);
  const [currentSelectedOption, setCurrentSelectedOption] =
    useState<boolean>(false);
  const [alcImageSource, setAlcImageSource] = useState(vodka);
  const [currentShotIsSelected, setCurrentShotIsSelected] =
    useState<boolean>(false);

  const isAnyOptionSelected = options.some((option) => option.selected);

  const handleStepProgress = () => {
    setSelectedOption("shot");
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
    const res = ShotIsSelected();
    setIsTransition(res);
  }, [shot, ShotIsSelected]);

  useEffect(() => {
    const selectedDrink = Object.values(obj).filter(
      (drink) => drink.title === shot.drink.name
    )[0];
    if (selectedDrink) {
      setAlcImageSource(selectedDrink.image.src);
    } else {
      setAlcImageSource(vodka);
    }
  }, [shot]);

  useEffect(() => {
    const res = getSelectedOption();
    setCurrentSelectedOption(res?.option === "shot");
  }, [steps, getSelectedOption, currentSelectedOption]);

  useEffect(() => {
    const res = ShotIsSelected();
    setCurrentShotIsSelected(res);
  }, [shot, ShotIsSelected]);

  const selectedStepFromStore = useStepProgressStore((s) => s.getCurrentStep());

  useEffect(() => {
    setCurrentStep(selectedStepFromStore);
  }, [selectedStepFromStore]);

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
        <TitleH1 selected={selected}>Shot</TitleH1>
        <SubTitleH2 selected={selected}>Fast!</SubTitleH2>

        {selected && (
          <>
            <CloseButtonComponent
              defaultFunction={handleClose}
              transitionStart={transitionStart}
              style={{ borderColor: "#ffd4a3" }}
            />
            <ShotGridComponent
              selected={selected}
              obj={obj}
              transitionEnd={transitionEnd && steps[1].selected}
              slideIn={false}
              slideOut={isTransition}
            />
            <SectionServiceName animatePosition={steps[3].selected}>
              <HeaderAlcohol>{shot?.drink.name}</HeaderAlcohol>
            </SectionServiceName>
            <PlantImageWrapper animationFadeIn={currentStep}>
              <PlantImage
                src={tropicalTwo}
                alt=""
                top={0}
                right={4}
                rotate={25}
              />
              <PlantImage
                src={tropicalOne}
                alt=""
                top={-6}
                right={2}
                rotate={2}
              />
              <PlantImage
                src={tropicalThree}
                alt=""
                top={0}
                right={55}
                rotate={-90}
              />
              <PlantImage
                src={tropicalFour}
                alt=""
                top={-12}
                right={40}
                rotate={-70}
              />
              <BlurredCircle />
            </PlantImageWrapper>
            <PaymentComponent
              animateShow={steps[3].selected}
              variant={4}
              priceSum={shot?.drink.price ?? 0}
              paymentClose={handleClose}
            />
          </>
        )}
      </SectionWrapper>
      <ImageSectionWrapper
        onClick={
          isAnyOptionSelected || transitionStart
            ? () => {}
            : () => handleStepProgress()
        }
      >
        <ImageAlc
          src={alcImageSource}
          alt="Floating Image"
          currentStep={currentStep}
          animationSelected={selected}
          animationSlide={isSlide}
          isBright={currentShotIsSelected}
          type={currentSelectedOption}
        />
      </ImageSectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !["selected", "slide"].includes(prop),
})<SectionWrapperProps>`
  width: ${(state) => (state.selected ? 96.4 : 41)}%;
  height: ${(state) => (state.selected ? 98 : 29)}%;
  background-color: #ff8c42;
  border-radius: ${(state) => (state.selected ? 4 : 3)}rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #ffb380;
  top: ${(state) => (state.selected ? -1 : 69)}%;
  right: ${(state) => (state.slide ? 1500 : state.selected ? -3 : 40)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1.withConfig({
  shouldForwardProp: (prop) => !["selected"].includes(prop),
})<TitleH1Props>`
  font-size: 7rem;
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

const ImageSectionWrapper = styled.section`
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ImageAlc = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "currentStep",
      "animationSelected",
      "animationSlide",
      "type",
      "isBright",
    ].includes(prop),
})<ImageProps>`
  position: absolute;
  top: ${(state) =>
    state.currentStep === 1
      ? 83
      : state.currentStep === 2 ||
        state.currentStep === 3 ||
        state.currentStep === 5
      ? !state.type
        ? 67
        : 70
      : state.currentStep === 6
      ? 70
      : 19}%;
  right: ${(state) =>
    state.currentStep === 6
      ? -100
      : state.currentStep === 4 && state.animationSelected
      ? 10
      : state.type || state.currentStep === 1
      ? -2.8
      : -1}%;
  filter: ${(state) =>
    state.isBright
      ? "brightness(1)"
      : state.currentStep === 1
      ? "brightness(1)"
      : "brightness(0.5)"};
  rotate: 9deg;
  width: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 290
      : 540}px;
  height: ${(state) =>
    state.currentStep <= 3 || state.currentStep === 5 || state.currentStep === 6
      ? 525
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
  shouldForwardProp: (prop) => !["top", "right", "rotate"].includes(prop),
})<PlantImageProps>`
  position: absolute;
  top: ${(props) => props.top}%;
  right: ${(props) => props.right}%;
  rotate: ${(props) => props.rotate}deg;
  width: 400px;
  height: 400px;
  animation: ${rotate} 2s ease-in-out infinite;
`;

const flicker = keyframes`
  0% { background-color: #ff9966; filter: blur(170px); }
  25% { background-color: #ff8855; filter: blur(90px); }
  50% { background-color: #ff7744; filter: blur(170px); }
  75% { background-color: #ff6633; filter: blur(130px); }
  100% { background-color: #ff8855; filter: blur(90px); }
`;

const BlurredCircle = styled.div`
  position: absolute;
  left: 8.5%;
  top: -18%;
  width: 800px;
  height: 800px;
  background-color: #ff9966;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  animation: ${flicker} 2s infinite alternate ease-in-out;
`;

const SectionServiceName = styled.section.withConfig({
  shouldForwardProp: (prop) => !["animatePosition"].includes(prop),
})<SectionServiceNameProps>`
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
  font-size: ${(props) => (props.animatePosition ? "4rem" : "2.3rem")};
`;

const HeaderAlcohol = styled.h1<{ bottom?: number; left?: number }>`
  color: #fff;
  margin: 0;
`;

export default ShotMenuComponent;
