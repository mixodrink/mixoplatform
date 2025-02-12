import React from 'react';
import { SectionWrapper, TitleH1, SubTitleH2, StyledSection, StyledDivRow } from './styled';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/StepsStore';

import OptionItemComponent from 'components/OptionItemComponent/OptionItemComponent';

import gin from 'assets/gin.png';
import vodka from 'assets/vodka.png';
import whiskey from 'assets/whiskey.png';
import rum from 'assets/rum.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

const SoftMenuComponent: React.FC = ({ isSlide, handleSetInitialState }: Props) => {
  const { setSelectedOption } = useMenuOptionSteps();
  const { goForward } = useStepProgressStore();
  const [selected, setSelected] = React.useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('soft');
    setSelected(true);
    goForward(1);
  };

  const handleSet = () => {
    handleSetInitialState();
    setSelected(false);
  };

  return (
    <SectionWrapper onClick={() => handleStepProgress()} selected={selected} slide={isSlide}>
      <TitleH1 selected={selected}>Soda</TitleH1>
      <SubTitleH2 selected={selected}>Perfect Refreshment!</SubTitleH2>

      {selected && (
        <button
          style={{ width: '100px', height: '50px', position: 'absolute', right: '0', top: '0' }}
          onClick={(e) => {
            e.stopPropagation();
            handleSet();
          }}
        >
          X
        </button>
      )}

      <StyledSection selected={selected}>
        <StyledDivRow>
          <OptionItemComponent
            title="Gin"
            image={{ src: gin, alt: 'Seagrams-Gin' }}
            selected={selected}
          />
          <OptionItemComponent
            title="Vodka"
            image={{ src: vodka, alt: 'Seagrams-Gin' }}
            selected={selected}
          />
        </StyledDivRow>
        <StyledDivRow>
          <OptionItemComponent
            title="Whiskey"
            image={{ src: whiskey, alt: 'Seagrams-Gin' }}
            selected={selected}
          />
          <OptionItemComponent
            title="Rum"
            image={{ src: rum, alt: 'Seagrams-Gin' }}
            selected={selected}
          />
        </StyledDivRow>
      </StyledSection>
    </SectionWrapper>
  );
};

export default SoftMenuComponent;
