import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import MixItemComponent from './MixItemComponent';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import { OptionListProps } from 'interfaces/OptionListProps';

const OptionListComponent: React.FC<OptionListProps> = ({
  type,
  obj,
  selected,
  transitionEnd,
  slide,
}) => {
  const { mix, setMixSelection, MixIsSelected } = useDrinkSelection();
  const drinkArray = Object.values(obj);

  const handleDrinkSelection = (drink) => {
    setMixSelection({ name: drink.title, price: 10 }, mix.soft);
  };

  useEffect(() => {
    const res = MixIsSelected();
    console.log(res);
  }, [mix, MixIsSelected]);

  return (
    <>
      {selected && (
        <GridContainer columns={2} slide={slide}>
          {drinkArray.map((drink, index) => (
            <MixItemComponent
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

export default OptionListComponent;
