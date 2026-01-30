import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import paymentPos from 'assets/icons/water-payment.png';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Props {
  cardImageSrc: string;
  waitTime?: number;
  onTimeout?: () => void;
  retryAttempt?: number;
}

const PaymentImagesComponent: React.FC<Props> = ({ cardImageSrc, waitTime = 10, onTimeout, retryAttempt = 0 }) => {
  const { steps } = useStepProgressStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();
    const duration = waitTime * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        if (onTimeout) {
          onTimeout();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [waitTime, onTimeout, retryAttempt]);

  return (
    <PaymentImagesWrapper isSlide={steps[4].selected}>
      <PaymentPosImage src={paymentPos} alt="Payment POS" />
      <CreditCardImage src={cardImageSrc} alt="Credit Card" />
      <Text>Pay using contactless</Text>
      <ProgressBarContainer>
        <ProgressBar progress={progress} />
      </ProgressBarContainer>
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
  top: 110%;
  width: 100%;
  font-size: 80px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  left: 10%;
  bottom: -30%;
  width: 80%;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.05s linear;
  border-radius: 6px;
`;

export default PaymentImagesComponent;
