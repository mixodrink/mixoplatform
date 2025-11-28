import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useDrinkSelection } from 'store/DrinkSelectionStore';

interface OptionItemProps {
  price: number;
  animateShow: boolean;
  variant: number;
  onPaymentClick: () => void;
  disabled?: boolean;
  showDoubleShot?: boolean;
}

interface SectionWrapperProps {
  animateShow: boolean;
  variant: number;
  disabled?: boolean;
}

interface ToggleBoxProps {
  variant: number;
  disabled?: boolean;
  selected?: boolean;
}

const PayButtonComponent: React.FC<OptionItemProps> = ({
  price,
  animateShow,
  variant,
  onPaymentClick,
  disabled = false,
  showDoubleShot = false,
}) => {
  const [doubleShot, setDoubleShot] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('doubleShot');
      setDoubleShot(stored === 'true');
    } catch (e) {
      setDoubleShot(false);
    }
  }, []);

  // keep local component state in sync with storage and same-window events
  useEffect(() => {
    const onCustom = (ev: Event) => {
      try {
        const detail = (ev as CustomEvent).detail;
        setDoubleShot(!!detail);
      } catch (e) {
        // ignore
      }
    };

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'doubleShot') {
        setDoubleShot(ev.newValue === 'true');
      }
    };

    window.addEventListener('doubleShotChange', onCustom as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('doubleShotChange', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleToggleDoubleShot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const next = !doubleShot;
    setDoubleShot(next);
    try {
      localStorage.setItem('doubleShot', next ? 'true' : 'false');
      // notify other components in same window that value changed
      try {
        window.dispatchEvent(new CustomEvent('doubleShotChange', { detail: next }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      // ignore
    }
    // update store so UI price updates immediately when toggle pressed
    try {
      const apply = useDrinkSelection.getState().applyDoubleShotToCurrentMix;
      if (typeof apply === 'function') apply(next);
    } catch (e) {
      // ignore
    }
  };

  return (
    <Container animateShow={animateShow} variant={variant} disabled={disabled}>
      {showDoubleShot && (
        <ToggleBox
          variant={variant}
          disabled={disabled}
          selected={doubleShot}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleToggleDoubleShot(e);
          }}
          role="button"
          aria-pressed={doubleShot}
          aria-label="Doble Shot"
          tabIndex={0}
        >
          <ToggleWrapper>
            <ToggleInner selected={doubleShot} />
            <ToggleLabel>Doble Shot</ToggleLabel>
          </ToggleWrapper>
        </ToggleBox>
      )}

      <SectionWrapper
        animateShow={animateShow}
        variant={variant}
        disabled={disabled}
        onClick={disabled ? undefined : onPaymentClick}
      >
        <SectionTitle>{price}€</SectionTitle>
        <SectionText>Pagar</SectionText>
      </SectionWrapper>
    </Container>
  );
};

const animationBorderMix = keyframes`
  0% {
    border-color: #ffc09b;
  }
  50% {
    border-color: #ff6a00;
  }
  100% {
    border-color: #ffc09b;
  }
`;

const animationBorderSoft = keyframes`
  0% {
    border-color: #d6c6ff
  }
  50% {
    border-color: #5f31d4;
  }
  100% {
    border-color: #d6c6ff;
  }
`;

const animationBorderWater = keyframes`
  0% {
    border-color: #a7e6ff
  }
  50% {
    border-color: #40c2f6;
  }
  100% {
    border-color: #a7e6ff;
  }
`;

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant', 'disabled'].includes(prop),
})<SectionWrapperProps>`
  position: absolute;
  bottom: 2.5%;
  right: 5.5%;
  width: 85%;
  height: 14%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.animateShow ? 1 : 0)};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
`;

const ToggleBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'disabled', 'selected'].includes(prop),
})<ToggleBoxProps>`
  flex: 0 0 28%;
  height: 100%;
  border-radius: 32px;
  background-color: ${(props) =>
    props.disabled
      ? '#cccccc'
      : props.variant === 1
      ? '#ff9c56'
      : props.variant === 2
      ? '#8150ff'
      : props.variant === 3
      ? '#6fd6ff'
      : null};
  border: 12px solid
    ${(props: any) => {
      if (props.disabled) return '#aaaaaa';
      if (props.selected) {
        // when selected, show a white outer border
        return '#ffffff';
      }
      return props.variant === 1
        ? '#ffc09b'
        : props.variant === 2
        ? '#d6c6ff'
        : props.variant === 3
        ? '#a7e6ff'
        : '#ffffff';
    }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'pointer')};
  animation: ${(props: any) => {
    if (props.disabled) return 'none';
    if (props.selected) return 'none';
    if (props.variant === 1)
      return css`
        ${animationBorderMix} 2s infinite
      `;
    if (props.variant === 2)
      return css`
        ${animationBorderSoft} 2s infinite
      `;
    if (props.variant === 3)
      return css`
        ${animationBorderWater} 2s infinite
      `;
    return 'none';
  }};
`;

const SectionWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['animateShow', 'variant', 'disabled'].includes(prop),
})<SectionWrapperProps>`
  flex: 1 1 auto;
  height: 100%;
  border-radius: 40px;
  background-color: ${(props) =>
    props.disabled
      ? '#cccccc'
      : props.variant === 1
      ? '#ff9c56'
      : props.variant === 2
      ? '#8150ff'
      : props.variant === 3
      ? '#6fd6ff'
      : null};
  border: 20px solid
    ${(props) =>
      props.disabled
        ? '#aaaaaa'
        : props.variant === 1
        ? '#ffc09b'
        : props.variant === 2
        ? '#d6c6ff'
        : props.variant === 3
        ? '#a7e6ff'
        : null};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'pointer')};
  animation: ${(props: any) => {
    if (props.disabled) return 'none';
    if (props.variant === 1)
      return css`
        ${animationBorderMix} 2s infinite
      `;
    if (props.variant === 2)
      return css`
        ${animationBorderSoft} 2s infinite
      `;
    if (props.variant === 3)
      return css`
        ${animationBorderWater} 2s infinite
      `;
    return 'none';
  }};
`;

const SectionTitle = styled.h1`
  font-size: 8rem;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1;
`;

const SectionText = styled.p`
  font-size: 8rem;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

const ToggleInner = styled.div<{ selected: boolean }>`
  display: none;
`;

const ToggleLabel = styled.span`
  font-size: 2.4rem;
  color: #fff;
`;

export default PayButtonComponent;
