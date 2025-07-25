import React from 'react';
import styled, { keyframes } from 'styled-components';

import paymentPos from 'assets/icons/water-payment.png';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Props {
  cardImageSrc: string;
}

const PaymentImagesComponent: React.FC<Props> = ({ cardImageSrc }) => {
  const { steps } = useStepProgressStore();
  return (
    <PaymentImagesWrapper isSlide={steps[4].selected}>
      <PaymentPosImage src={paymentPos} alt="Payment POS" />
      <CreditCardImage src={cardImageSrc} alt="Credit Card" />
      <Text>Pay using contactless</Text>
    </PaymentImagesWrapper>
  );
};

interface PaymentImagesWrapperProps {
  isSlide: boolean;
}

const PaymentImagesWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSlide'].includes(prop),
})<PaymentImagesWrapperProps>`
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.isSlide ? 1 : 0)};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const PaymentPosImage = styled.img`
  width: 600px;
  height: 350px;
`;

const slideAndRotate = keyframes`
  0% {
    left: 25%;
    top: 2%;
    transform: rotate(25deg);
  }
  50% {
    left: 55%;
    top: 35%;
    transform: rotate(0deg);
  }
  100% {
    left: 25%;
    top: 2%;
    transform: rotate(25deg);
  }
`;

const CreditCardImage = styled.img`
  position: absolute;
  left: 4%;
  top: 25%;
  width: 350px;
  height: 350px;
  animation: ${slideAndRotate} 4s ease-in-out infinite;
`;

const Text = styled.p`
  position: absolute;
  left: 2%;
  top: 85%;
  width: 100%;
  font-size: 80px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
`;

export default PaymentImagesComponent;
