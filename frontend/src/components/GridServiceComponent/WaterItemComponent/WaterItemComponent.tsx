import React from 'react';
import styled from 'styled-components';

import water from 'assets/soft/water.png';

interface OptionItemProps {
  animationSlideIn: boolean;
  animationSlideOut: boolean;
  animationBackSlideOut: boolean;
}

interface DrinkImageProps {
  onClick: () => void;
  animationSlideIn: boolean;
  animationSlideOut: boolean;
  animationBackSlideOut: boolean;
}

const WaterOptionComponent: React.FC<OptionItemProps & { onClick: () => void }> = ({
  onClick,
  animationSlideIn,
  animationSlideOut,
  animationBackSlideOut,
}) => {
  return (
    <DrinkImage
      onClick={onClick}
      src={water}
      alt="water"
      animationSlideIn={animationSlideIn}
      animationSlideOut={animationSlideOut}
      animationBackSlideOut={animationBackSlideOut}
    />
  );
};

const DrinkImage = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['animationSlideIn', 'animationSlideOut', 'animationBackSlideOut'].includes(prop),
})<DrinkImageProps>`
  width: ${(props) => (props.animationSlideIn ? (props.animationBackSlideOut ? 240 : 370) : 180)}px;
  height: ${(props) =>
    props.animationSlideIn ? (props.animationBackSlideOut ? 395 : 650) : 273}px;
  margin-bottom: 0px;
  rotate: 9deg;
  position: absolute;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
  bottom: ${(props) => (props.animationSlideIn ? (props.animationBackSlideOut ? 10 : 37) : 9)}%;
  right: ${(props) =>
    props.animationSlideIn
      ? props.animationBackSlideOut
        ? 2
        : 29
      : props.animationSlideOut
      ? -100
      : 48}%;
  z-index: 1;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

export default WaterOptionComponent;
