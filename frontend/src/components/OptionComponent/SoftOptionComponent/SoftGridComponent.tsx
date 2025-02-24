import React from 'react';
import styled, { keyframes } from 'styled-components';
import SoftItemComponent from './SoftItemComponent';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import { OptionListProps } from 'interfaces/OptionListProps';

const SoftListComponent: React.FC<OptionListProps> = ({
  type,
  obj,
  selected,
  transitionEnd,
  slide,
}) => {
  const drinkArray = Object.values(obj);

  const { setSoftSelection } = useDrinkSelection();

  const handleDrinkSelection = (drink) => {
    setSoftSelection({ name: drink.title, price: 3 });
  };

  return (
    <>
      {selected && (
        <GridContainer columns={2} slide={slide}>
          {drinkArray.map((drink, index) => (
            <SoftItemComponent
              key={index}
              drink={drink}
              type={type}
              handleDrinkSelection={!transitionEnd ? handleDrinkSelection : () => {}}
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

const GridContainer = styled.div<{ columns: number; slide: boolean }>`
  width: 80%;
  margin: auto;
  padding: 20px;
  position: absolute;
  top: 20%;
  left: ${(props) => (props.slide ? 1500 : 8)}%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 50px;
  justify-content: center;
  align-items: center;
  animation: 2s ${fadeIn};
`;

export default SoftListComponent;
