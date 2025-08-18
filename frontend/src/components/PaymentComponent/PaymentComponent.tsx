import React, { useCallback, useState } from "react";
import styled from "styled-components";
import PayButtonComponent from "./PayButtonComponent";
import PaymentProcessingComponent from "./PaymentProcessingComponent";
import PaymentSuccessComponent from "./PaymentSuccessComponent";
import PaymentErrorComponent from "./PaymentErrorComponent";
import card from "assets/icons/credit-mix.png";
import PaymentReadComponent from "components/PaymentComponent/PaymentReadComponent";
import ServiceVideoComponent from "components/AnimationComponents/ServiceAnimationComponente";
import { useStepProgressStore } from "store/ProgressStepsStore";
import { useMenuOptionSteps } from "store/MenuOptionStore";
import { useDrinkSelection } from "store/DrinkSelectionStore";
import { usePaymentFlow } from "hooks/usePaymentFlow";
import { createDrink } from "api/local/create-drink";
import { nodeRedLedWorker, nodeRedStartService } from "api/local/node-red";
import { ServiceType } from "models/models";
import { createCloudService } from "utils/cloudServiceUtils";
import { PostServiceEC2Cloud } from "api/cloud/api-cloud";

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
  const { goForward, goBack, steps } = useStepProgressStore();
  const { options } = useMenuOptionSteps();
  const { mix, soft, water } = useDrinkSelection();
  const { paymentState, startPaymentFlow, cancelPayment } = usePaymentFlow();
  const [retryCount, setRetryCount] = useState(0);

  const STEP_PAYMENT_PAID = steps[5].selected;
  const STEP_4 = steps[3].selected;

  const handlePaymentError = useCallback(() => {
    setRetryCount(0);
    paymentClose();
    goBack(1);
  }, [paymentClose, goBack]);

  const executePaymentFlow = useCallback(async () => {
    const selected = options.find((o) => o.selected);
    if (!selected) return { success: false, error: "No option selected" };

    try {
      await nodeRedLedWorker({ mode: "enable" });
      const result = await startPaymentFlow(10);

      if (!result.success) {
        await nodeRedLedWorker({ mode: "disable" });
        return { success: false, error: result.error };
      }

      // Extract card data from payment flow response
      const cardData = result.data?.card;
      const cardId = cardData?.cardId || "UNKNOWN_CARD_ID";
      const cardNumber = cardData?.maskedPan || cardData?.cardNumber || "UNKNOWN_CARD_NUMBER";

      const base = {
        machineId: "650a0ab291e870d4bd7e5c85",
        paymentType: 0,
        cardId,
        cardNumber,
      };

      let newDrink = (() => {
        if (selected.option === "mix") {
          return {
            ...base,
            type: ServiceType.MIX,
            drink: [mix.alcohol.name, mix.soft.name].filter(
              (d): d is string => d !== null
            ),
            price: mix.alcohol.price + mix.soft.price,
          };
        }
        if (selected.option === "soft") {
          return {
            ...base,
            type: ServiceType.BIB,  
            drink: [soft.drink.name].filter((d): d is string => d !== null),
            price: soft.drink.price,
          };
        }
        if (selected.option === "water") {
          return {
            ...base,
            type: ServiceType.WATER, // ServiceType.WATER
            drink: [water.drink.name].filter((d): d is string => d !== null),
            price: water.drink.price,
          };
        }
        return null;
      })();

      if (!newDrink) {
        await nodeRedLedWorker({ mode: "disable" });
        return { success: false, error: "Invalid drink config" };
      }

      // Create the drink locally
      await createDrink(newDrink);

      // Create cloud service data from the local drink
      const cloudServiceData: PostServiceEC2Cloud = {
        machineId: "662d0650564844eb53b404ce",
        type: ServiceType[newDrink.type],
        alcohol: newDrink.type === ServiceType.MIX ? newDrink.drink[0] : undefined ,
        bib: newDrink.type === ServiceType.BIB || newDrink.type === ServiceType.WATER ? newDrink.drink[0] : newDrink.drink[1],
        price: newDrink.price,
        paymentType: newDrink.paymentType.toString(),
        cardId: newDrink.cardId,
        cardNumber: newDrink.cardNumber,
        sessions: 1, // Default to 1 session
      };

      // Create the service in the cloud (this will auto-authenticate)
      try {
        await createCloudService(cloudServiceData);
        console.log('Cloud service created successfully');
      } catch (cloudError) {
        console.warn('Failed to create cloud service (continuing with local service):', cloudError);
        // Don't fail the entire process if cloud fails, just log the warning
      }

      await nodeRedStartService(newDrink);
      await nodeRedLedWorker({ mode: "disable" });
      goForward(6);
      setRetryCount(0);
      return { success: true };
    } catch (err) {
      await nodeRedLedWorker({ mode: "disable" });
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }, [options, mix, soft, water, priceSum, startPaymentFlow, goForward]);

  const handlePaymentStart = useCallback(async () => {
    if (!STEP_4 || paymentState.isProcessing) return;
    goForward(5);

    const result = await executePaymentFlow();
    if (result.success) return;

    if (retryCount < 1) {
      setRetryCount((c) => c + 1);
      setTimeout(async () => {
        const retry = await executePaymentFlow();
        if (!retry.success) handlePaymentError();
      }, 1000);
    } else {
      handlePaymentError();
    }
  }, [
    STEP_4,
    paymentState.isProcessing,
    executePaymentFlow,
    retryCount,
    goForward,
    handlePaymentError,
  ]);

  const handlePaymentCancel = useCallback(async () => {
    await cancelPayment();
    await nodeRedLedWorker({ mode: "disable" });
    handlePaymentError();
  }, [cancelPayment, handlePaymentError]);

  const handleRetryPayment = useCallback(async () => {
    await cancelPayment();
    setRetryCount(0);
    setTimeout(handlePaymentStart, 500);
  }, [cancelPayment, handlePaymentStart]);

  return (
    <>
      <PaymentOverlayContainer>
        {paymentState.currentStep === "reading-card" && (
          <PaymentReadComponent cardImageSrc={card} />
        )}
        {(paymentState.currentStep === "authorizing" ||
          paymentState.currentStep === "committing") && (
          <PaymentProcessingComponent
            currentStep={paymentState.currentStep}
            variant={variant}
          />
        )}
        {paymentState.currentStep === "success" && (
          <PaymentSuccessComponent variant={variant} />
        )}
        {paymentState.currentStep === "error" && (
          <PaymentErrorComponent
            variant={variant}
            onRetry={handleRetryPayment}
            onCancel={handlePaymentCancel}
          />
        )}
      </PaymentOverlayContainer>

      <PayButtonComponent
        price={priceSum}
        animateShow={animateShow}
        variant={variant}
        onPaymentClick={handlePaymentStart}
        disabled={
          paymentState.isProcessing || paymentState.currentStep === "error"
        }
      />

      {STEP_PAYMENT_PAID && (
        <ServiceVideoComponent handleClose={paymentClose} />
      )}
    </>
  );
};

const PaymentOverlayContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
`;

export default PaymentComponent;
