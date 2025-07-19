import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import MixItemComponent from './MixItemComponent';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import { OptionListInterface } from 'interfaces/OptionListInterface';
import { useStepProgressStore } from 'store/ProgressStepsStore';

interface Drink {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  price: number;
}

const MixGridComponent: React.FC<OptionListInterface> = ({
  obj,
  selected,
  transitionEnd,
  slideIn,
  slideOut,
}) => {
  const { mix, setMixSelection } = useDrinkSelection();
  const { goForward } = useStepProgressStore();
  const [drinkAnimationSelected, setDrinkAnimationSelected] = React.useState<string>('');
  const drinkArray = Object.values(obj);

  const handleDrinkSelection = (drink: Drink) => {
    if (drink?.title) {
      const safeName = drink.title as string;
      const softDrink = mix.soft.name ? { name: mix.soft.name, price: mix.soft.price } : { name: '', price: 0 };
      setMixSelection({ name: safeName, price: drink.price }, softDrink);
      goForward(3);
    }
  };

  useEffect(() => {
    setDrinkAnimationSelected(mix.alcohol.name || '');
  }, [mix]);

  return (
    <>
      {selected && (
        <GridContainer columns={2} slideIn={slideIn} slideOut={slideOut}>
          {drinkArray.map((drink, index) => (
            <MixItemComponent
              animationSelected={drinkAnimationSelected === drink.title}
              key={index}
              drink={drink}
              handleDrinkSelection={
                transitionEnd && mix?.alcohol.name != drink.title && mix?.alcohol.name !== ''
                  ? () => {
                      handleDrinkSelection(drink);
                    }
                  : () => {}
              }
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

interface GridContainerProps {
  columns: number;
  slideIn: boolean;
  slideOut: boolean;
}

const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['columns', 'slideIn', 'slideOut'].includes(prop),
})<GridContainerProps>`
  width: 80%;
  margin: auto;
  padding: 20px;
  position: absolute;
  top: 17%;
  left: ${(props) => (props.slideOut ? -100 : 8)}%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 40px;
  justify-content: center;
  align-items: center;
  animation: 2s ${fadeIn};
  transition: left 0.8s ease-in-out;
`;

export default MixGridComponent;
