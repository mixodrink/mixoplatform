import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface OptionItemProps {
  type: string;
  drink: { title: string; image: { src: string; alt: string }; price: number };
  handleDrinkSelection: () => void;
  animationSelected: boolean;
}

const SoftItemComponent: React.FC<OptionItemProps> = ({
  type,
  drink,
  handleDrinkSelection,
  animationSelected,
}) => {
  return (
    <OptionContainer onClick={() => handleDrinkSelection(drink)}>
      <BackgroundBox mod={type} animationSelected={animationSelected} />
      <DrinkImage
        src={drink.image.src}
        alt={drink.image.alt}
        animationSelected={animationSelected}
      />
      <DrinkTitle>{drink.title}</DrinkTitle>
    </OptionContainer>
  );
};

export default SoftItemComponent;

const rotate = keyframes`
  0% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
`;

const OptionContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const BackgroundBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['mod', 'animationSelected'].includes(prop),
})`
  width: 250px;
  height: ${(props) => (props.animationSelected ? 290 : 250)}px;
  position: absolute;
  bottom: 0;
  border-radius: 3rem;
  border: ${(props) =>
    props.mod === 'mix'
      ? props.animationSelected
        ? '20px solid #fff'
        : '20px solid #ffd8c1'
      : props.animationSelected
      ? '20px solid #fff'
      : '20px solid #d8c9ff'};
  background: ${(props) =>
    props.animationSelected ? (props.mod === 'mix' ? '#ffd8c1' : '#d8c9ff') : '#fff'};
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
  transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DrinkImage = styled.img<{ animationSelected: boolean }>`
  width: 130px;
  height: 240px;
  margin-bottom: 0px;
  z-index: 1;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
  ${({ animationSelected }) =>
    animationSelected &&
    css`
      animation: ${rotate} 2s ease-in-out infinite;
    `}
`;

const DrinkTitle = styled.h2`
  font-size: 3rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  color: #313131;
  z-index: 1;
`;
