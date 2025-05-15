import React, { useState, useEffect } from "react";

import PayButtonComponent from "./PayButtonComponent";
import card from "assets/icons/credit-mix.png";
import PaymentImagesComponent from "components/PaymentComponent/PaymentImagesComponent";
import ServiceVideoComponent from "components/AnimationComponents/ServiceAnimationComponente";
import { useStepProgressStore } from "store/ProgressStepsStore";
import { useDrinkSelection } from "store/DrinkSelectionStore";

interface OptionItemProps {
  animateShow: boolean;
  variant: number;
  priceSum: number;
  paymentClose: () => void;
}

const PaymentComponent: React.FC<OptionItemProps> = ({
  animateShow,
  variant,
  priceSum,
  paymentClose,
}) => {
  const { steps } = useStepProgressStore();
  const { getDrinkName } = useDrinkSelection();
  const [drinkName, setDrinkName] = useState("");

  useEffect(() => {
    if (steps[5].selected) {
      let drinkName = getDrinkName();
      setDrinkName(drinkName);
    }
  }, [steps]);

  return (
    <>
      <PaymentImagesComponent cardImageSrc={card} />
      <PayButtonComponent
        price={priceSum}
        animateShow={animateShow}
        variant={variant}
        handlePaymentClose={paymentClose}
      />
      {steps[5].selected && (
        <ServiceVideoComponent handleClose={paymentClose} drinkName={drinkName} />
      )}
    </>
  );
};

export default PaymentComponent;
