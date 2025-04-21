import React from 'react';
// import styled from 'styled-components';
import PayButtonComponent from './PayButtonComponent';
import card from 'assets/icons/credit-mix.png';
import PaymentImagesComponent from 'components/PaymentComponent/PaymentImagesComponent';
import ServiceVideoComponent from 'components/AnimationComponents/ServiceAnimationComponente';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface OptionItemProps {
  animateShow: boolean;
  variant: number;
  priceSum: number;
  paymentClose: () => void;
}

const PaymentComponent: React.FC<OptionItemProps> = ({
  animateShow,
  variant,
  priceSum,
  paymentClose,
}) => {
  const { steps } = useStepProgressStore();

  return (
    <>
      <PaymentImagesComponent cardImageSrc={card} />
      <PayButtonComponent
        price={priceSum}
        animateShow={animateShow}
        variant={variant}
        handlePaymentClose={() => paymentClose()}
      />
      {steps[5].selected && <ServiceVideoComponent handleClose={paymentClose} />}
    </>
  );
};

// const SectionWrapper = styled.img.withConfig({
//   shouldForwardProp: (prop) => ![].includes(prop),
// })``;

export default PaymentComponent;
