import React, { useEffect, useState } from "react";
import styled from "styled-components";

import water from "assets/animation/Agua.mp4";
import cola from "assets/animation/BebidaCola.mp4";
import energy from "assets/animation/BebidaEnergetica.mp4";
import lemon from "assets/animation/BebidaLimon.mp4";
import orange from "assets/animation/BebidaNaranja.mp4";
import tonic from "assets/animation/BebidaTonica.mp4";

import lightLemon from "assets/animation/GinLimon.mp4";
import lightEnergy from "assets/animation/GinEnergetica.mp4";
import lightTonic from "assets/animation/GinTonic.mp4";
import lightOrange from "assets/animation/GinNaranja.mp4";

import darkCola from "assets/animation/RonCola.mp4";
import darkLemon from "assets/animation/RonLimon.mp4";
import darkEnergy from "assets/animation/RonEnergetica.mp4";
import darkOrangee from "assets/animation/RonNaranja.mp4";

interface AnimationProps {
  handleClose: () => void;
  drinkName: string;
}

const ServiceAnimationComponent: React.FC<AnimationProps> = ({
  handleClose,
  drinkName,
}) => {
  const getVideoByDrinkName = (name: string): string => {
    const drink = name.toLowerCase();

    const softDrinks: Record<string, string> = {
      water,
      cola,
      energy,
      lemon,
      orange,
      tonic,
      lime: tonic,
    };

    const mixerToVideoLight: Record<string, string> = {
      cola: lightEnergy,
      lemon: lightLemon,
      energy: lightEnergy,
      tonic: lightTonic,
      lime: lightTonic,
      orange: lightOrange,
    };

    const mixerToVideoDark: Record<string, string> = {
      cola: darkCola,
      lemon: darkLemon,
      lime: darkLemon,
      tonic: darkLemon,
      energy: darkEnergy,
      orange: darkOrangee,
    };

    const lightAlc1 = "gin";
    const lightAlc2 = "vodka";
    const darkAlc1 = "rum";
    const darkAlc2 = "whisky";

    // Check soft drinks first
    if (softDrinks[drink]) {
      return softDrinks[drink];
    }

    // Handle alcohol + mixer
    const [alc, mixer] = drink.split(" ");

    if ((alc === lightAlc1 || alc === lightAlc2) && mixerToVideoLight[mixer]) {
      return mixerToVideoLight[mixer];
    }

    if ((alc === darkAlc1 || alc === darkAlc2) && mixerToVideoDark[mixer]) {
      return mixerToVideoDark[mixer];
    }

    // Fallback
    return water;
  };

  const videoSrc = getVideoByDrinkName(drinkName);

  return (
    <SectionWrapper>
      <VideoStyled
        autoPlay
        muted
        onEnded={() => handleClose()}
        src={videoSrc}
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
