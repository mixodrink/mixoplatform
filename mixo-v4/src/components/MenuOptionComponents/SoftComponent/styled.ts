import styled from 'styled-components';

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMenuMode',
})`
  width: 93%;
  height: ${(state) => (state.selected ? 96 : 30)}%;
  background-color: #7959ca;
  border-radius: 3rem;
  position: absolute;
  top: ${(state) => (state.selected ? 2 : 35)}%;
  right: ${(state) => (state.slide ? 1300 : 40)}px;
  transition: 0.5s ease-in-out;
`;

const TitleH1 = styled.h1<{ selected: string }>`
  font-size: ${(props) => (props.selected ? 6 : 10)}rem;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: ${(props) => (props.selected ? 0 : 20)}px;
  left: 40px;
  color: #fff;
  transition: top 0.5s ease-in-out, font-size 0.5s ease-in-out;
`;

const SubTitleH2 = styled.h2<{ selected: string }>`
  font-size: 4rem;
  font-weight: 400;
  line-height: 10rem;
  margin: 0;
  position: absolute;
  top: 135px;
  left: 40px;
  color: #fff;
  overflow: hidden;
  height: ${(props) => (!props.selected ? 'auto' : '0')};
  max-height: ${(props) => (!props.selected ? '500px' : '0')}; /* Adjust as needed */
  opacity: ${(props) => (!props.selected ? 1 : 0)};
  transition: max-height 2s ease-in-out, opacity 1s ease-in-out;
`;

const StyledSection = styled.section<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80%;
  top: 210px;
  left: 100px;
  position: absolute;
  opacity: ${(props) => (props.selected ? '1' : '0')};
  transition: opacity 0.5s cubic-bezier(0.3, 0, 0, 1);
`;

const StyledDivRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  gap: 50px;
`;

export { SectionWrapper, TitleH1, SubTitleH2, StyledSection, StyledDivRow };
