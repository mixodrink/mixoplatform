import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { createDrink } from 'api/local/create-drink';
import { connectNodeRed } from 'api/local/node-red';

import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

interface OptionItemProps {
  price: number;
  animateShow: boolean;
  variant: number;
}

interface SectionWrapperProps {
  animateShow: boolean;
  variant: number;
}

const PayButtonComponent: React.FC<OptionItemProps> = ({ price, animateShow, variant }) => {
  const { goForward, steps } = useStepProgressStore();
  const { options } = useMenuOptionSteps();
  const { mix, soft, water } = useDrinkSelection();

  const handleAddDrink = async () => {
    goForward(5);

    // Get the selected option
    const selectedOption = options.find((option) => option.selected);

    if (!selectedOption) return;

    let newDrink;

    if (selectedOption.option === 'mix') {
      newDrink = {
        machineId: '12I72P128391H8120D01291JS1',
        type: 0,
        drink: [mix.alcohol.name, mix.soft.name],
        paymentType: 0,
        price: mix.alcohol.price + mix.soft.price,
        cardId: 'AB12HDB293SN02',
        cardNumber: '1234567890123456',
      };
    } else if (selectedOption.option === 'soft') {
      newDrink = {
        machineId: '12I72P128391H8120D01291JS1',
        type: 1,
        drink: [soft.drink.name],
        paymentType: 0,
        price: soft.drink.price,
        cardId: 'AB12HDB293SN02',
        cardNumber: '1234567890123456',
      };
    } else if (selectedOption.option === 'water') {
      newDrink = {
        machineId: '12I72P128391H8120D01291JS1',
        type: 2,
        drink: [water.drink.name],
        paymentType: 0,
        price: water.drink.price,
        cardId: 'AB12HDB293SN02',
        cardNumber: '1234567890123456',
      };
    }

    if (newDrink) {
      try {
        await createDrink(newDrink);
        await connectNodeRed(newDrink);
      } catch (error) {
        console.error('Error creating drink:', error);
      }
    }
  };

  return (
    <SectionWrapper
      animateShow={animateShow}
      variant={variant}
      onClick={!steps[3].selected ? () => {} : () => handleAddDrink()}
    >
      <SectionTitle>{price}€</SectionTitle>
      <SectionText>Pay</SectionText>
    </SectionWrapper>
  );
};

const animationBorderMix = keyframes`
  0% {
    border-color: #ffc09b;
  }
  50% {
    border-color: #ff6a00;
  }
  100% {
    border-color: #ffc09b;
  }
`;

const animationBorderSoft = keyframes`
  0% {
    border-color: #d6c6ff
  }
  50% {
    border-color: #5f31d4;
  }
  100% {
    border-color: #d6c6ff;
  }
`;

const animationBorderWater = keyframes`
  0% {
    border-color: #a7e6ff
  }
  50% {
    border-color: #40c2f6;
  }
  100% {
    border-color: #a7e6ff;
  }
`;

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant'].includes(prop),
})<SectionWrapperProps>`
  position: absolute;
  bottom: 2.5%;
  right: 5.5%;
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
      : null};
  border: 20px solid
    ${(props) =>
      props.variant === 1
        ? '#ffc09b'
        : props.variant === 2
        ? '#d6c6ff'
        : props.variant === 3
        ? '#a7e6ff'
        : null};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 50px;
  opacity: ${(props) => (props.animateShow ? 1 : 0)};
  animation: ${(props) => {
    if (props.variant === 1)
      return css`
        ${animationBorderMix} 2s infinite
      `;
    if (props.variant === 2)
      return css`
        ${animationBorderSoft} 2s infinite
      `;
    if (props.variant === 3)
      return css`
        ${animationBorderWater} 2s infinite
      `;
    return 'none';
  }};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
`;

const SectionTitle = styled.h1`
  font-size: 10rem;
  color: #fff;
  margin-top: 180px;
`;

const SectionText = styled.p`
  font-size: 10rem;
  color: #fff;
  margin-top: 120px;
`;

export default PayButtonComponent;
