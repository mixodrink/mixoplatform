import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface OptionItemProps {
  price: number;
  animateShow: boolean;
  variant: number;
  onPaymentClick: () => void;
  disabled?: boolean;
}

interface SectionWrapperProps {
  animateShow: boolean;
  variant: number;
  disabled?: boolean;
}

const PayButtonComponent: React.FC<OptionItemProps> = ({ 
  price, 
  animateShow, 
  variant, 
  onPaymentClick, 
  disabled = false 
}) => {
  return (
    <SectionWrapper
      animateShow={animateShow}
      variant={variant}
      disabled={disabled}
      onClick={disabled ? undefined : onPaymentClick}
    >
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
  shouldForwardProp: (prop) => !['animateShow', 'variant', 'disabled'].includes(prop),
})<SectionWrapperProps>`
  position: absolute;
  bottom: 2.5%;
  right: 5.5%;
  width: 85%;
  height: 14%;
  border-radius: 40px;
  background-color: ${(props) =>
    props.disabled ? '#cccccc' :
    props.variant === 1
      ? '#ff9c56'
      : props.variant === 2
      ? '#8150ff'
      : props.variant === 3
      ? '#6fd6ff'
      : null};
  border: 20px solid
    ${(props) =>
      props.disabled ? '#aaaaaa' :
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
    if (props.disabled) return 'none';
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
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
