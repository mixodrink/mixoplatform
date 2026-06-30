import React from 'react';
import styled from 'styled-components';
import CloseButtonComponent from 'components/ButtonComponents/CloseButtonComponent';

interface Props {
  onContinue: () => void;
  onClose: () => void;
  borderColor: string;
  variant: number; // 1=cocktail/mix, 2=soft, 3=water
}

const PlaceYourGlassComponent: React.FC<Props> = ({ onContinue, onClose, borderColor, variant }) => {
  return (
    <Overlay>
      <CloseButtonComponent
        defaultFunction={onClose}
        transitionStart={false}
        style={{ borderColor }}
      />
      <Title>Coloca tu vaso en el punto de servicio</Title>
      <ContinueButton onClick={onContinue} variant={variant}>
        <ButtonText>Continuar</ButtonText>
      </ContinueButton>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 150;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
`;

const Title = styled.h1`
  position: absolute;
  bottom: calc(5% + 14% + 2rem);
  font-size: 4.5rem;
  font-weight: 300;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.3;
  max-width: 85%;
`;

interface ContinueButtonProps {
  variant: number;
}

const ContinueButton = styled.button<ContinueButtonProps>`
  position: absolute;
  bottom: 5%;
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
      : '#ff9c56'};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ButtonText = styled.p`
  font-size: 8rem;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1;
`;

export default PlaceYourGlassComponent;
