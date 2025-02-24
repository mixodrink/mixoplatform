import React from 'react';
import styled from 'styled-components';

interface OptionItemProps {
  type: string;
  drink: { title: string; image: { src: string; alt: string }; price: number };
  handleDrinkSelection: () => void;
}

const SoftItemComponent: React.FC<OptionItemProps> = ({ type, drink, handleDrinkSelection }) => {
  return (
    <OptionContainer onClick={() => handleDrinkSelection(drink)} mod={type}>
      <BackgroundBox mod={type} />
      <DrinkImage src={drink.image.src} alt={drink.image.alt} mod={type} />
      <DrinkTitle mod={type}>{drink.title}</DrinkTitle>
    </OptionContainer>
  );
};

export default SoftItemComponent;

const OptionContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const BackgroundBox = styled.div`
  width: ${(props) => (props.mod === 'mix' ? '350px' : '300px')};
  height: ${(props) => (props.mod === 'mix' ? '350px' : '300px')};
  position: absolute;
  bottom: 0;
  border-radius: 3rem;
  border: ${(props) => (props.mod === 'mix' ? '20px solid #ffc09b' : '20px solid #d8c9ff')};
  background: #fff;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
`;
const DrinkImage = styled.img`
  width: ${(props) => (props.mod === 'mix' ? '130px' : '130px')};
  height: ${(props) => (props.mod === 'mix' ? '440px' : '240px')};
  margin-bottom: 0px;
  z-index: 1;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
`;

const DrinkTitle = styled.h2`
  font-size: ${(props) => (props.mod === 'mix' ? '4' : '3')}rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  color: #313131;
  z-index: 1;
`;
