import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import tropicalOne from 'assets/plants/tropical-one.png';
import tropicalTwo from 'assets/plants/tropical-two.png';
import tropicalThree from 'assets/plants/tropical-three.png';
import tropicalFour from 'assets/plants/tropical-four.png';

interface Props {
  imageSelected: number;
}

const PlantAnimationComponent: React.FC<Props> = ({ imageSelected }) => {
  return (
    <>
      <PlantImageWrapper animationFadeIn={imageSelected}>
        <PlantImage src={tropicalTwo} alt="" top={-3} right={6} rotate={25} />
        <PlantImage src={tropicalOne} alt="" top={-8} right={6} rotate={2} />
        <PlantImage src={tropicalThree} alt="" top={-6} right={52} rotate={-90} />
        <PlantImage src={tropicalFour} alt="" top={-16} right={40} rotate={-70} />
        <BlurredCircle />
      </PlantImageWrapper>
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

const PlantImageWrapper = styled.section<{ animationFadeIn: number }>`
  position: absolute;
  top: 47%;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  display: ${(props) => (props.animationFadeIn === 4 ? 'block' : 'none')};
  transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  ${({ animationFadeIn }) =>
    animationFadeIn === 4 &&
    css`
      animation: 2s ${fadeIn} 0.5s forwards;
    `}
`;

const rotate = keyframes`
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100%{
    transform: rotate(-10deg);
  }
`;

const PlantImage = styled.img<{ top: number; right: number; rotate: number }>`
  position: absolute;
  top: ${(props) => props.top}%;
  right: ${(props) => props.right}%;
  rotate: ${(props) => props.rotate}deg;
  width: 400px;
  height: 400px;
  animation: ${rotate} 2s ease-in-out infinite;
`;

const flicker = keyframes`
  0% { background-color: #deacff; filter: blur(170px); }
  25% { background-color: #cd82ff; filter: blur(90px); }
  50% { background-color: #bf67fa; filter: blur(170px); }
  75% { background-color: #ad35fe; filter: blur(130px); }
  100% { background-color: #9e0dff; filter: blur(90px); }
`;

const BlurredCircle = styled.div`
  position: absolute;
  left: 8.5%;
  top: -18%;
  width: 800px;
  height: 800px;
  background-color: #f4b413;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  animation: ${flicker} 2s infinite alternate ease-in-out;
`;

export default PlantAnimationComponent;
