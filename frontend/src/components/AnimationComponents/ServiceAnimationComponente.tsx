import React from 'react';
import styled from 'styled-components';

import video from 'assets/animation/GinLimon.mp4';

interface AnimationProps {
  handleClose: () => void;
}

const ServiceAnimationComponent: React.FC<AnimationProps> = ({ handleClose }) => {
  return (
    <SectionWrapper>
      <VideoStyled
        autoPlay
        muted
        onEnded={() => handleClose()}
        src={video}
      />
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
`;


const VideoStyled = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 42px;
`;

export default ServiceAnimationComponent;
