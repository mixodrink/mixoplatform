import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import SoftGridComponent from '../../OptionComponent/SoftOptionComponent/SoftGridComponent';

import cola from 'assets/soft/cola.png';
import lemon from 'assets/soft//lemon.png';
import tonic from 'assets/soft/tonic.png';
import orange from 'assets/soft/orange.png';
import energy from 'assets/soft/energy.png';
import close from 'assets/icons/close.png';

interface Props {
  isSlide: boolean;
  handleSetInitialState: () => void;
}

const SoftMenuComponent: React.FC = ({ isSlide, handleSetInitialState }: Props) => {
  const { setSelectedOption } = useMenuOptionSteps();
  const { goForward } = useStepProgressStore();
  const [selected, setSelected] = React.useState<boolean>(false);
  const [transitionEnd, setTransitionEnd] = React.useState<boolean>(false);

  const handleStepProgress = () => {
    setSelectedOption('soft');
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
    cola: {
      title: 'Cola',
      image: { src: cola, alt: 'cola' },
      price: 5,
    },
    lemon: {
      title: 'Lemon',
      image: { src: lemon, alt: 'Lemon' },
      price: 5,
    },
    tonic: {
      title: 'Tonic',
      image: { src: tonic, alt: 'Tonix' },
      price: 5,
    },
    orange: {
      title: 'Lima',
      image: { src: orange, alt: 'Lima' },
      price: 5,
    },
    energy: {
      title: 'Energy',
      image: { src: energy, alt: 'Energy' },
      price: 5,
    },
  };

  return (
    <SectionWrapper
      onTouchStart={() => handleStepProgress()}
      selected={selected}
      slide={isSlide}
      onTransitionEnd={handleOnTransitionEnd}
      onTransitionStart={handleOnTransitionEnd}
    >
      <TitleH1 selected={selected}>Soda</TitleH1>
      <SubTitleH2 selected={selected}>Perfect Refreshment!</SubTitleH2>

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

      <SoftGridComponent
        type={'soft'}
        selected={selected}
        obj={obj}
        transitionEnd={transitionEnd}
      />
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMenuMode',
})`
  width: 89%;
  height: ${(state) => (state.selected ? 94 : 29)}%;
  background-color: #5f31d4;
  border-radius: 3rem;
  position: absolute;
  border: 20px solid #d8c9ff;
  top: ${(state) => (state.selected ? 2 : 34.5)}%;
  right: ${(state) => (state.slide ? 1500 : 40)}px;
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

const SubTitleH2 = styled.h2`
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
  border: 6px solid #d8c9ff;
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

export default SoftMenuComponent;
