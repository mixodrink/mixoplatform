import React from "react";
import styled from "styled-components";

import qr from "assets/custom/nbinstaqr.png";

interface Props {
  isSlide: boolean;
}

interface WrapperProps {
  slide: boolean;
}

const InstagramQRComponent: React.FC<Props> = ({ isSlide }) => {
  return (
    <SectionWrapper slide={isSlide}>
      <QrImage src={qr} alt="Instagram QR" />
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !["slide"].includes(prop),
})<WrapperProps>`
  width: 41%;
  height: 20%;
  background-color: #fbeaa0;
  border: 20px solid #fdf3c4;
  border-radius: 3rem;
  position: absolute;
  bottom: 290px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(state) => (state.slide ? "translateX(140%)" : "translateX(0)")};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

const QrImage = styled.img`
  display: block;
  height: 96%;
  width: 96%;
  object-fit: contain;
`;

export default InstagramQRComponent;
