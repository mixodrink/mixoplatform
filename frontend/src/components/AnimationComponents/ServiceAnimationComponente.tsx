import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import { useMenuOptionSteps } from 'store/MenuOptionStore';

// Import all video files
import Agua from 'assets/animation/Agua.mp4';
import BebidaCola from 'assets/animation/BebidaCola.mp4';
import BebidaEnergetica from 'assets/animation/BebidaEnergetica.mp4';
import BebidaLimon from 'assets/animation/BebidaLimon.mp4';
import BebidaNaranja from 'assets/animation/BebidaNaranja.mp4';
import BebidaTonica from 'assets/animation/BebidaTonica.mp4';
import GinEnergetica from 'assets/animation/GinEnergetica.mp4';
import GinLimon from 'assets/animation/GinLimon.mp4';
import GinNaranja from 'assets/animation/GinNaranja.mp4';
import GinTonic from 'assets/animation/GinTonic.mp4';
import RonCola from 'assets/animation/RonCola.mp4';
import RonEnergetica from 'assets/animation/RonEnergetica.mp4';
import RonLimon from 'assets/animation/RonLimon.mp4';
import RonNaranja from 'assets/animation/RonNaranja.mp4';

interface AnimationProps {
  handleClose: () => void;
}

const ServiceAnimationComponent: React.FC<AnimationProps> = ({ handleClose }) => {
  const { mix, soft, water } = useDrinkSelection();
  const { getSelectedOption } = useMenuOptionSteps();

  // Create a mapping of video names to imported files
  const videoMap: Record<string, string> = {
    Water: Agua,
    Cola: BebidaCola,
    Energy: BebidaEnergetica,
    Lemon: BebidaLimon,
    Orange: BebidaNaranja,
    Tonic: BebidaTonica,
    GinCola: GinEnergetica,
    GinEnergy: GinEnergetica,
    GinLemon: GinLimon,
    GinOrange: GinNaranja,
    GinTonic: GinTonic,
    RonCola: RonCola,
    RonEnergy: RonEnergetica,
    RonLemon: RonLimon,
    RonOrange: RonNaranja,
    RonTonic: RonLimon,
  };

  // Determine the video source based on selected drink
  const videoSrc = useMemo(() => {
    const selectedOption = getSelectedOption();

    if (!selectedOption) {
      return GinLimon; // Default fallback
    }

    switch (selectedOption.option) {
      case 'mix':
        if (mix.alcohol.name && mix.soft.name) {
          // Format: {Alcohol}{Soft} (e.g., GinLimon, RonCola)
          if (mix.alcohol.name === 'Gin' || mix.alcohol.name === 'Vodka') {
            const videoName = `Gin${mix.soft.name}`;
            return videoMap[videoName] || GinLimon; // Fallback to default if not found
          } else {
            const videoName = `Ron${mix.soft.name}`;
            return videoMap[videoName] || GinLimon; // Fallback to default if not found
          }
        }
        return GinLimon;

      case 'soft':
        if (soft.drink.name) {
          // Format: Bebida{Soft} (e.g., BebidaCola, BebidaLimon)
          const videoName = `Bebida${soft.drink.name}`;
          return videoMap[videoName] || BebidaCola; // Fallback to default if not found
        }
        return BebidaCola;

      case 'water':
        return Agua;

      default:
        return GinLimon; // Default fallback
    }
  }, [mix, soft, water, getSelectedOption]);

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
