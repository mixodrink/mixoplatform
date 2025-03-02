import React from 'react';
import styled from 'styled-components';

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
      <DrinkImage src={drink.image.src} alt={drink.image.alt} />
      <DrinkTitle>{drink.title}</DrinkTitle>
    </OptionContainer>
  );
};

export default MixItemComponent;

const OptionContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const BackgroundBox = styled.div<{ animationSelected: boolean }>`
  width: 330px;
  height: ${(props) => (props.animationSelected ? 500 : 330)}px;
  position: absolute;
  bottom: 0;
  border-radius: 3rem;
  border: 20px solid #ffc09b;
  background: ${(props) => (props.animationSelected ? '#ffc09b' : '#fff')};
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
  transition: 0.8s ease-in-out;
`;
const DrinkImage = styled.img`
  width: 150px;
  height: 450px;
  margin-bottom: 0px;
  z-index: 1;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
`;

const DrinkTitle = styled.h2`
  font-size: 4rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  color: #313131;
  z-index: 1;
`;
