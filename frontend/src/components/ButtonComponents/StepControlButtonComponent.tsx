import React from 'react';
import styled from 'styled-components';

import arrow from 'assets/icons/arrow.png';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Props {
  animateArrowBack: boolean;
  animateArrowForward: boolean;
  handleSetSoftTransition: void;
  handleClose: void;
  resSoft: boolean;
  resMix?: boolean;
  handleSetMixTransition?: void;
  type: string;
}

const StepControlButtonComponent: React.FC<Props> = ({
  animateArrowBack,
  animateArrowForward,
  handleSetSoftTransition,
  handleClose,
  resSoft,
  resMix,
  handleSetMixTransition,
  type,
}) => {
  const { steps, goForward, goBack } = useStepProgressStore();

  const handleGoBack = () => {
    const currentStepNumber = steps.findIndex((step) => step.selected);
    if (type === 'soft') {
      if (steps[2].selected) {
        goBack(1);
        handleClose();
      } else {
        goBack(2);
        handleSetSoftTransition(true);
      }
    } else {
      if (currentStepNumber === 1) {
        goBack(1);
        handleClose();
        handleSetMixTransition(!resMix);
        handleSetSoftTransition(!resSoft);
      } else if (currentStepNumber === 3) {
        handleSetSoftTransition(!resSoft);
        goBack(currentStepNumber);
      } else {
        handleSetMixTransition(!resMix);
        handleSetSoftTransition(!resSoft);
        goBack(currentStepNumber);
      }
    }
  };

  const handleGoForward = () => {
    const currentStepNumber = steps.findIndex((step) => step.selected);
    if (type === 'soft') {
      console.log(steps[3].selected);
      console.log(animateArrowForward);
      if (steps[3].selected && animateArrowForward) {
        goForward(4);
        handleSetSoftTransition(!resSoft);
      }
    } else {
      if (currentStepNumber === 1) {
        goForward(3);
        handleSetMixTransition(true);
      } else if (currentStepNumber === 2) {
        goForward(4);
        handleSetSoftTransition(true);
      }
    }
  };

  return (
    <>
      <SectionWrapper>
        <BackButton animateShow={animateArrowBack} onTouchStart={() => handleGoBack()}>
          <ArrowImage src={arrow} alt="" />
        </BackButton>
        <ForwardButton animateShow={animateArrowForward} onTouchStart={() => handleGoForward()}>
          <ArrowImage src={arrow} alt="" variant={true} />
        </ForwardButton>
      </SectionWrapper>
    </>
  );
};

const SectionWrapper = styled.section`
  position: absolute;
  bottom: 37.5%;
  display: flex;
  justify-content: space-between;
  width: 100%;
  z-index: 30;
`;

const BackButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow'].includes(prop),
})`
  width: 120px;
  height: 200px;
  border: none;
  background-color: #ffc09b;
  margin-left: -30px;
  border-radius: 0 30px 30px 0;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ForwardButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow'].includes(prop),
})`
  width: 120px;
  height: 200px;
  border: none;
  background-color: #ffc09b;
  margin-right: -30px;
  border-radius: 30px 0 0 30px;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ArrowImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  position: absolute;
  top: 12%;
  left: ${(props) => (props.variant ? '88%' : '-3%')};
  width: 150px;
  height: 150px;
  transform: ${(props) => (props.variant ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export default StepControlButtonComponent;
