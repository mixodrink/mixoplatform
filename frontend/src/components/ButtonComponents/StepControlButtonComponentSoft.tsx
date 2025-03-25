import React from 'react';
import styled from 'styled-components';

import arrow from 'assets/icons/arrow.png';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Props {
  animateArrowBack: boolean;
  animateArrowForward: boolean;
  handleClose: void;
  clickableState: boolean;
}

const StepControlButtonComponentSoft: React.FC<Props> = ({
  animateArrowBack,
  animateArrowForward,
  handleClose,
  clickableState,
}) => {
  const { steps, goForward, goBack } = useStepProgressStore();

  const handleGoBack = () => {
    if (steps[1].selected || steps[2].selected) {
      goBack(1);
      handleClose();
    } else if (steps[3].selected) {
      goBack(3);
    }
  };

  const handleGoForward = () => {
    const currentStepNumber = steps.findIndex((step) => step.selected);
    if (currentStepNumber === 2) {
      goForward(4);
    }
  };

  return (
    <>
      <SectionWrapper>
        <BackButton
          animateShow={animateArrowBack && !steps[4].selected}
          onClick={!clickableState ? () => {} : () => handleGoBack()}
        >
          <ArrowImageLeft src={arrow} alt="" />
        </BackButton>
        <ForwardButton
          animateShow={animateArrowForward && !steps[4].selected && !steps[3].selected}
          onClick={!clickableState ? () => {} : () => handleGoForward()}
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
  z-index: 15;
`;

const BackButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant'].includes(prop),
})`
  position: absolute;
  left: 0%;
  width: 120px;
  height: 300px;
  border: none;
  background-color: #d8c9ff;
  margin-left: -30px;
  border-radius: 0 30px 30px 0;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ForwardButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['animateShow'].includes(prop),
})`
  position: absolute;
  left: 90.8%;
  width: 120px;
  height: 300px;
  border: none;
  background-color: #d8c9ff;
  margin-right: -30px;
  border-radius: 30px 0 0 30px;
  display: ${(props) => (props.animateShow ? 'block' : 'none')};
`;

const ArrowImageLeft = styled.img.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  position: absolute;
  top: 25%;
  left: -8%;
  width: 150px;
  height: 150px;
  transform: rotate(0deg);
`;

const ArrowImageRight = styled.img.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  position: absolute;
  top: 25%;
  left: -17%;
  width: 150px;
  height: 150px;
  transform: rotate(180deg);
`;

export default StepControlButtonComponentSoft;
