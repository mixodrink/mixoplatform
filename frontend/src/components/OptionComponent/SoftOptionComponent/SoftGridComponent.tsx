import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SoftItemComponent from './SoftItemComponent';
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

interface GridContainerProps {
  columns: number;
  slideIn: boolean;
  slideOut: boolean;
}

const SoftGridComponent: React.FC<OptionListInterface> = ({
  type,
  obj,
  selected,
  transitionEnd,
  slideIn,
  slideOut,
}) => {
  const drinkArray = Object.values(obj);
  const { mix, soft, setSoftSelection, setMixSelection } = useDrinkSelection();
  const { goForward } = useStepProgressStore();
  const [drinkAnimationSelected, setDrinkAnimationSelected] = React.useState<string>('');

  const handleDrinkSelection = (drink: Drink) => {
    if (type === 'mix') {
      const alcohol = mix.alcohol.name ? { name: mix.alcohol.name, price: mix.alcohol.price } : { name: '', price: 0 };
      setMixSelection(alcohol, { name: drink.title, price: drink.price });
    } else {
      setSoftSelection({ name: drink.title, price: drink.price });
    }
    goForward(4);
  };

  useEffect(() => {
    if (type === 'mix') {
      setDrinkAnimationSelected(mix.soft.name ?? '');
    } else {
      setDrinkAnimationSelected(soft.drink.name ?? '');
    }
  }, [soft, mix, type]);

  return (
    <>
      {selected && (
        <GridContainer columns={2} slideIn={slideIn} slideOut={slideOut}>
          {drinkArray.map((drink, index) => (
            <SoftItemComponent
              key={index}
              drink={drink}
              type={type || ''}
              animationSelected={drinkAnimationSelected === drink.title}
              handleDrinkSelection={
                transitionEnd && soft?.drink.name != drink.title && soft?.drink.name !== ''
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

const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['columns', 'slideIn', 'slideOut'].includes(prop),
})<GridContainerProps>`
  width: 80%;
  margin: auto;
  padding: 20px;
  position: absolute;
  top: 20%;
  left: ${(props) =>
    props.slideIn && props.slideOut ? -100 : props.slideIn ? -100 : props.slideOut ? 8 : 100}%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 50px;
  justify-content: center;
  align-items: center;
  animation: 2s ${fadeIn};
  transition: left 0.8s ease-in-out;
`;

export default SoftGridComponent;
