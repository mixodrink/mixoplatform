import React from 'react';
import styled, { keyframes } from 'styled-components';
import OptionItemComponent from './OptionItemComponent';
import { useDrinkSelection } from '../../store/DrinkSelectionStore';

interface OptionListProps {
  type: string;
  obj: { drink: { title: string; image: { src: string; alt: string }; price: number } };
  selected: boolean;
}

const OptionListComponent: React.FC<OptionListProps> = ({ type, obj, selected }) => {
  const drinkArray = Object.values(obj);

  const { setSelectedDrink } = useDrinkSelection();

  const handleDrinkSelection = (drink) => {
    if (type === 'mix') {
      setSelectedDrink({
        alc: drink.title,
        soft: drink.title,
        type: type,
        price: drink.price,
      });
    } else {
      setSelectedDrink({
        soft: drink.title,
        type: type,
        price: drink.price,
      });
    }
  };

  return (
    <>
      {selected && (
        <GridContainer columns={2}>
          {drinkArray.map((drink, index) => (
            <OptionItemComponent
              key={index}
              drink={drink}
              type={type}
              handleDrinkSelection={handleDrinkSelection}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
`;

const GridContainer = styled.div<{ columns: number }>`
  width: 80%;
  margin: auto;
  padding: 20px;
  position: absolute;
  top: 20%;
  left: 8%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 50px;
  justify-content: center;
  align-items: center;
  animation: 2s ${fadeIn};
`;

export default OptionListComponent;
