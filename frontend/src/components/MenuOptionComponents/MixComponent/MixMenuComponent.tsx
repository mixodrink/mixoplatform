import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import OptionListComponent from '../../OptionComponent/OptionListComponent';

import gin from 'assets/alcohol/gin.png';
import vodka from 'assets/alcohol/vodka.png';
import whiskey from 'assets/alcohol/whiskey.png';
import rum from 'assets/alcohol/rum.png';
import close from 'assets/icons/close.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

const MixMenuComponent: React.FC<Props> = ({ isSlide, handleSetInitialState }) => {
  const { setSelectedOption } = useMenuOptionSteps();
  const { goForward } = useStepProgressStore();
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = React.useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('mix');
    setSelected(true);
    goForward(1);
  };

  const handleSet = () => {
    handleSetInitialState();
    setSelected(false);
  };

  const handleOnTransitionEnd = () => {
    setTransitionEnd(!transitionEnd);
  };

  useEffect(() => {
    console.log('transitionEnd', transitionEnd);
  }, [transitionEnd]);

  const obj = {
    gin: {
      title: 'Gin',
      image: { src: gin, alt: 'gin' },
      price: 6,
    },
    vodka: {
      title: 'Vodka',
      image: { src: vodka, alt: 'vodka' },
      price: 6,
    },
    whiskey: {
      title: 'Whiskey',
      image: { src: whiskey, alt: 'whiskey' },
      price: 6,
    },
    rum: {
      title: 'Rum',
      image: { src: rum, alt: 'rum' },
      price: 6,
    },
  };

  return (
    <SectionWrapper
      onTouchStart={transitionEnd ? () => {} : () => handleStepProgress()}
      onTransitionEnd={handleOnTransitionEnd}
      onTransitionStart={handleOnTransitionEnd}
      selected={selected}
      slide={isSlide}
    >
      <TitleH1 selected={selected}>Cocktail</TitleH1>
      <SubTitleH2>Create your Drink!</SubTitleH2>

      {selected && (
        <>
          <CloseButton
            onClick={
              transitionEnd
                ? () => {}
                : (e) => {
                    e.stopPropagation();
                    handleSet();
                  }
            }
          >
            <img src={close} alt="" width={30} />
          </CloseButton>
          <OptionListComponent type={'mix'} selected={selected} obj={obj} />
        </>
      )}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section<{ selected: string }>`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #fd660e;
  border-radius: 3rem;
  clip-path: inset(0 0 0 0);
  position: absolute;
  border: 20px solid #ffc09b;
  top: 40px;
  left: ${(state) => (state.slide ? 1500 : 43)}px;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 20px;
  left: 40px;
  color: #fff;
`;

const SubTitleH2 = styled.h2<{ selected: string }>`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 145px;
  left: 40px;
  color: #fff;
  overflow: hidden;
`;

const CloseButton = styled.button`
  width: 100px;
  height: 100px;
  background: #ffffff78; /* White background */
  border-radius: 20px; /* Rounded corners */
  position: absolute;
  right: 20px;
  top: 20px;
  border: none;
  font-size: 1.5rem;
  border: 6px solid #ffd8c1;
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

export default MixMenuComponent;
