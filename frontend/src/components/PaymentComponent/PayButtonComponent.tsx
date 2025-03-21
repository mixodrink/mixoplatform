import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface OptionItemProps {
  price: number;
  animateShow: boolean;
  variant: number;
}

interface SectionWrapperProps {
  animateShow: boolean;
  variant: number;
}

const PayButtonComponent: React.FC<OptionItemProps> = ({ price, animateShow, variant }) => {
  const { goForward } = useStepProgressStore();

  const handleTouch = () => {
    goForward(5);
    console.log('done');
  };
  return (
    <SectionWrapper animateShow={animateShow} variant={variant} onTouchStart={() => handleTouch}>
      <SectionTitle>{price}€</SectionTitle>
      <SectionText>Pay</SectionText>
    </SectionWrapper>
  );
};

const animationBorderMix = keyframes`
  0% {
    border-color: #ffc09b;
  }
  50% {
    border-color: #ff6a00;
  }
  100% {
    border-color: #ffc09b;
  }
`;

const animationBorderSoft = keyframes`
  0% {
    border-color: #d6c6ff
  }
  50% {
    border-color: #5f31d4;
  }
  100% {
    border-color: #d6c6ff;
  }
`;

const animationBorderWater = keyframes`
  0% {
    border-color: #a7e6ff
  }
  50% {
    border-color: #40c2f6;
  }
  100% {
    border-color: #a7e6ff;
  }
`;

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant'].includes(prop),
})<SectionWrapperProps>`
  position: absolute;
  bottom: 2.5%;
  right: 5.5%;
  width: 85%;
  height: 14%;
  border-radius: 40px;
  background-color: ${(props) =>
    props.variant === 1
      ? '#ff9c56'
      : props.variant === 2
      ? '#8150ff'
      : props.variant === 3
      ? '#6fd6ff'
      : null};
  border: 20px solid
    ${(props) =>
      props.variant === 1
        ? '#ffc09b'
        : props.variant === 2
        ? '#d6c6ff'
        : props.variant === 3
        ? '#a7e6ff'
        : null};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 50px;
  opacity: ${(props) => (props.animateShow ? 1 : 0)};
  animation: ${(props) => {
    if (props.variant === 1)
      return css`
        ${animationBorderMix} 2s infinite
      `;
    if (props.variant === 2)
      return css`
        ${animationBorderSoft} 2s infinite
      `;
    if (props.variant === 3)
      return css`
        ${animationBorderWater} 2s infinite
      `;
    return 'none';
  }};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
`;

const SectionTitle = styled.h1`
  font-size: 10rem;
  color: #fff;
  margin-top: 180px;
`;

const SectionText = styled.p`
  font-size: 10rem;
  color: #fff;
  margin-top: 120px;
`;

export default PayButtonComponent;
