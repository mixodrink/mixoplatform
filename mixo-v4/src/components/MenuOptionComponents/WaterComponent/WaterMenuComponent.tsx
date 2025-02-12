import React from 'react';
import { SectionWrapper, TitleH1, SubTitleH2 } from './styled';
import { useMenuOptionSteps } from '../../../store/MenuOptionStore';
import { useStepProgressStore } from 'store/StepsStore';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

const WaterMenuComponent: React.FC = ({ isSlide, handleSetInitialState }: Props) => {
  const { setSelectedOption } = useMenuOptionSteps();
  const { goForward } = useStepProgressStore();
  const [selected, setSelected] = React.useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('water');
    setSelected(true);
    goForward(1);
  };

  const handleSet = () => {
    handleSetInitialState();
    setSelected(false);
  };

  return (
    <SectionWrapper onClick={() => handleStepProgress()} selected={selected} slide={isSlide}>
      <TitleH1 selected={selected}>Water</TitleH1>
      <SubTitleH2 selected={selected}>Super Fresh!</SubTitleH2>

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
    </SectionWrapper>
  );
};

export default WaterMenuComponent;
