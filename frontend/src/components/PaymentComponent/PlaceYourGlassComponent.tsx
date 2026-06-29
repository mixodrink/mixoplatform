import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface Props {
  variant: number;
  bgColor: string;
  onContinue: () => void;
}

const PlaceYourGlassComponent: React.FC<Props> = ({ variant, bgColor, onContinue }) => {
  return (
    <Overlay bgColor={bgColor}>
      <Title>Pon tu vaso</Title>
      <ContinueButton variant={variant} onClick={onContinue}>
        <ButtonText>Continuar</ButtonText>
      </ContinueButton>
    </Overlay>
  );
};

const Overlay = styled.div.withConfig({
  shouldForwardProp: (prop) => !['bgColor'].includes(prop),
})<{ bgColor: string }>`
  position: absolute;
  inset: 0;
  z-index: 150;
  background-color: ${(props) => props.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
`;

const Title = styled.h1`
  font-size: 11rem;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.1;
`;

interface ButtonProps {
  variant: number;
}

const animationBorderMix = keyframes`
  0% { border-color: #ffc09b; }
  50% { border-color: #ff6a00; }
  100% { border-color: #ffc09b; }
`;

const animationBorderSoft = keyframes`
  0% { border-color: #d6c6ff; }
  50% { border-color: #5f31d4; }
  100% { border-color: #d6c6ff; }
`;

const animationBorderWater = keyframes`
  0% { border-color: #a7e6ff; }
  50% { border-color: #40c2f6; }
  100% { border-color: #a7e6ff; }
`;

const ContinueButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})<ButtonProps>`
  position: absolute;
  bottom: 5%;
  right: 5.5%;
  width: 85%;
  height: 14%;
  border-radius: 40px;
  background-color: ${(props) =>
    props.variant === 1 ? '#ff9c56' : props.variant === 2 ? '#8150ff' : '#6fd6ff'};
  border: 20px solid
    ${(props) =>
      props.variant === 1 ? '#ffc09b' : props.variant === 2 ? '#d6c6ff' : '#a7e6ff'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  animation: ${(props) =>
    props.variant === 1
      ? css`${animationBorderMix} 2s infinite`
      : props.variant === 2
      ? css`${animationBorderSoft} 2s infinite`
      : css`${animationBorderWater} 2s infinite`};
`;

const ButtonText = styled.p`
  font-size: 8rem;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1;
`;

export default PlaceYourGlassComponent;
