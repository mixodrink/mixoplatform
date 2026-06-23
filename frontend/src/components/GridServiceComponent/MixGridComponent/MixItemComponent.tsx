import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface OptionItemProps {
  drink: { title: string; image: { src: string; alt: string }; price: number };
  handleDrinkSelection: () => void;
  animationSelected: boolean;
}

const MixItemComponent: React.FC<OptionItemProps> = ({
  drink,
  handleDrinkSelection,
  animationSelected,
}) => {
  return (
    <OptionContainer onClick={() => handleDrinkSelection(drink)}>
      <BackgroundBox animationSelected={animationSelected} />
      <DrinkImage
        src={drink.image.src}
        alt={drink.image.alt}
        animationSelected={animationSelected}
        isGin={drink.image.alt === 'gin'}
        isTequila={drink.image.alt === 'Tequila'}
      />
      <DrinkTitle>{drink.title}</DrinkTitle>
    </OptionContainer>
  );
};

export default MixItemComponent;

const rotate = keyframes`
  0% {
    rotate: 5deg;
  }
  50% {
    rotate: -5deg;
  }
  100% {
    rotate: 5deg;
  }
`;

const OptionContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
`;

const BackgroundBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['animationSelected'].includes(prop),
})`
  width: 330px;
  height: ${(props) => (props.animationSelected ? 500 : 330)}px;
  position: absolute;
  bottom: 0;
  border-radius: 3rem;
  border: 20px solid ${(props) => (props.animationSelected ? '#fff' : '#ffc09b')};
  background: ${(props) => (props.animationSelected ? '#ffc09b' : '#fff')};
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
  transition: 0.8s ease-in-out;
`;

const DrinkImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !['animationSelected', 'isGin', 'isTequila'].includes(prop),
})<{ animationSelected: boolean; isGin?: boolean; isTequila?: boolean }>`
  width: ${({ isGin, isTequila }) => (isGin ? 216 : isTequila ? 200 : 150)}px;
  height: ${({ isGin }) => (isGin ? 540 : 450)}px;
  margin-bottom: ${({ isGin }) => (isGin ? -90 : 0)}px;
  z-index: 1;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
  transform: ${({ isGin, isTequila }) =>
    isGin ? 'scaleX(2.31) translateY(-60px)' : isTequila ? 'scaleX(2.5)' : 'none'};
  ${({ animationSelected }) =>
    animationSelected &&
    css`
      animation: ${rotate} 2s ease-in-out infinite;
    `}
`;

const DrinkTitle = styled.h2`
  font-size: 4rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  color: #313131;
  z-index: 1;
`;
