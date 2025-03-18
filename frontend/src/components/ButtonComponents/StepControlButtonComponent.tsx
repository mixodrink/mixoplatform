import React from 'react';
import styled from 'styled-components';

import arrow from 'assets/icons/arrow.png';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Props {
  animateArrowBack: boolean;
  animateArrowForward: boolean;
  handleSetSoftTransition: void;
  handleSetMixTransition?: void;
  handleClose: void;
  resSoft: boolean;
  clickableState: boolean;
  resMix?: boolean;
}

const StepControlButtonComponent: React.FC<Props> = ({
  animateArrowBack,
  animateArrowForward,
  handleSetSoftTransition,
  handleSetMixTransition,
  handleClose,
  resSoft,
  clickableState,
  resMix,
}) => {
  const { steps, goForward, goBack } = useStepProgressStore();

  const handleGoBack = () => {
    const currentStepNumber = steps.findIndex((step) => step.selected);
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
  };

  const handleGoForward = () => {
    const currentStepNumber = steps.findIndex((step) => step.selected);
    if (currentStepNumber === 1) {
      goForward(3);
      handleSetMixTransition(true);
    } else if (currentStepNumber === 2) {
      goForward(4);
      handleSetSoftTransition(true);
    }
  };

  return (
    <>
      <SectionWrapper>
        <BackButton
          animateShow={animateArrowBack}
          onTouchStart={!clickableState ? () => {} : () => handleGoBack()}
        >
          <ArrowImageLeft src={arrow} alt="" />
        </BackButton>
        <ForwardButton
          animateShow={animateArrowForward}
          onTouchStart={!clickableState ? () => {} : () => handleGoForward()}
        >
          <ArrowImageRight src={arrow} alt="" variant={true} />
        </ForwardButton>
      </SectionWrapper>
    </>
  );
};
const SectionWrapper = styled.section`
  position: absolute;
  bottom: 54%;
  width: 100%;
  z-index: 30;
`;

const BackButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant'].includes(prop),
})`
  position: absolute;
  left: 2%;
  width: 120px;
  height: 300px;
  border: none;
  background-color: #ffc09b;
  margin-left: -30px;
  border-radius: 0 30px 30px 0;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ForwardButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow'].includes(prop),
})`
  position: absolute;
  left: 89%;
  width: 120px;
  height: 300px;
  border: none;
  background-color: #ffc09b;
  margin-right: -30px;
  border-radius: 30px 0 0 30px;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ArrowImageLeft = styled.img.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  position: absolute;
  top: 25%;
  left: -15%;
  width: 150px;
  height: 150px;
  transform: rotate(0deg);
`;

const ArrowImageRight = styled.img.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  position: absolute;
  top: 25%;
  left: -10%;
  width: 150px;
  height: 150px;
  transform: rotate(180deg);
`;

export default StepControlButtonComponent;
