import styled from 'styled-components';

const SectionWrapper = styled.section`
  width: 93%;
  height: ${(state) => (state.selected ? 96 : 30)}%;
  background-color: #97dffc;
  border-radius: 3rem;
  position: absolute;
  bottom: 40px;
  left: ${(state) => (state.slide ? 1300 : 40)}px;
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

export { SectionWrapper, TitleH1, SubTitleH2 };
