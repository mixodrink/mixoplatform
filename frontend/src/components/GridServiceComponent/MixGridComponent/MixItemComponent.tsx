import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface CustomStyle {
  container?: React.CSSProperties;
  backgroundBox?: {
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    background?: string;
    backgroundSelected?: string;
    borderSelected?: string;
  };
  image?: {
    width?: string;
    height?: string;
  };
  title?: React.CSSProperties;
}

interface OptionItemProps {
  drink: { title: string; image: { src: string; alt: string }; price: number };
  handleDrinkSelection: (drink: { title: string; image: { src: string; alt: string }; price: number }) => void;
  animationSelected: boolean;
  customStyle?: CustomStyle;
}

const MixItemComponent: React.FC<OptionItemProps> = ({
  drink,
  handleDrinkSelection,
  animationSelected,
  customStyle,
}) => {
  return (
    <OptionContainer onClick={() => handleDrinkSelection(drink)} style={customStyle?.container}>
      <BackgroundBox animationSelected={animationSelected} customStyle={customStyle?.backgroundBox} />
      <DrinkImage
        src={drink.image.src}
        alt={drink.image.alt}
        animationSelected={animationSelected}
        customStyle={customStyle?.image}
      />
      <DrinkTitle style={customStyle?.title}>{drink.title}</DrinkTitle>
    </OptionContainer>
  );
};

export default MixItemComponent;

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
  z-index: 10;
`;

const BackgroundBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['animationSelected', 'customStyle'].includes(prop),
})<{ animationSelected: boolean; customStyle?: CustomStyle['backgroundBox'] }>`
  width: ${(props) => props.customStyle?.width || '330px'};
  height: ${(props) => 
    props.animationSelected 
      ? (props.customStyle?.height || '500px')
      : '330px'
  };
  position: absolute;
  bottom: 0;
  border-radius: ${(props) => props.customStyle?.borderRadius || '3rem'};
  border: ${(props) => 
    props.animationSelected 
      ? (props.customStyle?.borderSelected || '20px solid #fff')
      : (props.customStyle?.border || '20px solid #ffc09b')
  };
  background: ${(props) => 
    props.animationSelected 
      ? (props.customStyle?.backgroundSelected || '#ffc09b')
      : (props.customStyle?.background || '#fff')
  };
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
  transition: 0.8s ease-in-out;
`;

const DrinkImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !['animationSelected', 'customStyle'].includes(prop),
})<{ animationSelected: boolean; customStyle?: CustomStyle['image'] }>`
  width: ${(props) => props.customStyle?.width || '150px'};
  height: ${(props) => props.customStyle?.height || '450px'};
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
  font-size: 4rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  color: #313131;
  z-index: 1;
`;
