import React from 'react';
import styled from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import close from 'assets/icons/close.png';

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
    <SectionWrapper onTouchStart={() => handleStepProgress()} selected={selected} slide={isSlide}>
      <TitleH1 selected={selected}>Water</TitleH1>
      <SubTitleH2 selected={selected}>Super Fresh!</SubTitleH2>

      {selected && (
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            handleSet();
          }}
        >
          <img src={close} alt="" width={30} style={{ marginTop: 4 }}/>
        </CloseButton>
      )}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #40c2f6;
  border-radius: 3rem;
  position: absolute;
  bottom: 40px;
  border: 20px solid #b3e9ff;
  left: ${(state) => (state.slide ? 300 : 4)}%;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TitleH1 = styled.h1`
  font-size: 11rem;
  line-height: 10rem;
  margin: 0;
  color: #fff;
  position: absolute;
  top: 20px;
  left: 40px;
`;

const SubTitleH2 = styled.h2`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  color: #fff;
  margin: 0;
  position: absolute;
  top: 145px;
  left: 40px;
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
  border: 6px solid #b3e9ff;
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

export default WaterMenuComponent;
