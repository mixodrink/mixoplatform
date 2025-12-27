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
import { nodeRedStartService } from "api/local/node-red";
import { createCloudService } from "utils/cloudServiceUtils";
import { PostServiceEC2Cloud } from "api/cloud/api-cloud";

const MACHINE_ID_LOCAL = "650a0ab291e870d4bd7e5c85";
const MACHINE_ID_CLOUD = "662d0650564844eb53b404ce";
const MAX_RETRY_COUNT = 1;
const RETRY_DELAY_MS = 1000;
const PAYMENT_RESTART_DELAY_MS = 500;
const PAYMENT_TYPE = "Card";
const DEFAULT_SESSIONS = 1;
const DOUBLE_SHOT_STORAGE_KEY = "doubleShot";
const UNKNOWN_CARD_ID = "UNKNOWN_CARD_ID";
const UNKNOWN_CARD_NUMBER = "UNKNOWN_CARD_NUMBER";

const STEP_INDEX_MAIN_MENU = 1;
const STEP_INDEX_PAYMENT_PROCESSING = 5;
const STEP_INDEX_SERVICE_ANIMATION = 6;
const STEP_INDEX_PAYMENT_BUTTON = 3;
const STEP_INDEX_SERVICE_ANIMATION_CHECK = 5;

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
  const { goForward, steps } = useStepProgressStore();
  const { options } = useMenuOptionSteps();
  const { mix, soft, water } = useDrinkSelection();
  const { paymentState, startPaymentFlow, cancelPayment } = usePaymentFlow();
  const [retryCount, setRetryCount] = useState(0);

  const STEP_SERVICE_ANIMATION = steps[STEP_INDEX_SERVICE_ANIMATION_CHECK].selected;
  const STEP_PAYMENT_BUTTON = steps[STEP_INDEX_PAYMENT_BUTTON].selected;

  const getDoubleShot = (): boolean => {
    try {
      return localStorage.getItem(DOUBLE_SHOT_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  };

  const extractCardData = (result: any) => {
    const cardData = result.data?.card;
    return {
      cardId: cardData?.cardId || UNKNOWN_CARD_ID,
      cardNumber: cardData?.maskedPan || cardData?.cardNumber || UNKNOWN_CARD_NUMBER,
    };
  };

  const buildDrinkData = (selectedOption: any, cardInfo: { cardId: string; cardNumber: string }) => {
    const baseData = {
      machineId: MACHINE_ID_LOCAL,
      paymentType: PAYMENT_TYPE,
      cardId: cardInfo.cardId,
      cardNumber: cardInfo.cardNumber,
      price: priceSum,
    };

    const drinkConfigs = {
      mix: {
        type: "mix" as const,
        drink: [mix.alcohol.name, mix.soft.name].filter((d): d is string => d !== null),
        doubleShot: getDoubleShot(),
      },
      soft: {
        type: "soft" as const,
        drink: [soft.drink.name].filter((d): d is string => d !== null),
      },
      water: {
        type: "water" as const,
        drink: [water.drink.name].filter((d): d is string => d !== null),
      },
    };

    const config = drinkConfigs[selectedOption.option as keyof typeof drinkConfigs];
    return config ? { ...baseData, ...config } : null;
  };

  const buildCloudServiceData = (drinkData: any): PostServiceEC2Cloud => ({
    machineId: MACHINE_ID_CLOUD,
    type: drinkData.type,
    alcohol: drinkData.type === "mix" ? drinkData.drink[0] : undefined,
    bib: drinkData.type === "soft" || drinkData.type === "water" 
      ? drinkData.drink[0] 
      : drinkData.drink[1],
    price: drinkData.price,
    paymentType: drinkData.paymentType,
    cardId: drinkData.cardId,
    cardNumber: drinkData.cardNumber,
    sessions: DEFAULT_SESSIONS,
  });

  const executePaymentFlow = useCallback(async () => {
    const selectedOption = options.find((o) => o.selected);
    if (!selectedOption) {
      return { success: false, error: "No option selected" };
    }

    try {
      const DRINK_PRICE_CENTS = Math.round(priceSum * 100);
      const paymentResult = await startPaymentFlow(DRINK_PRICE_CENTS);

      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error };
      }

      const cardInfo = extractCardData(paymentResult);
      const drinkData = buildDrinkData(selectedOption, cardInfo);

      if (!drinkData) {
        return { success: false, error: "Invalid drink config" };
      }

      await createDrink(drinkData);

      const cloudServiceData = buildCloudServiceData(drinkData);
      try {
        await createCloudService(cloudServiceData);
        console.log("Cloud service created successfully");
      } catch (cloudError) {
        console.warn("Failed to create cloud service (continuing with local service):", cloudError);
      }

      await nodeRedStartService(drinkData);
      goForward(STEP_INDEX_SERVICE_ANIMATION);
      setRetryCount(0);
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }, [options, mix, soft, water, priceSum, startPaymentFlow, goForward]);

  const handlePaymentError = useCallback(() => {
    setRetryCount(0);
    paymentClose();
    goForward(STEP_INDEX_MAIN_MENU);
  }, [paymentClose, goForward]);

  const handlePaymentStart = useCallback(async () => {
    if (!STEP_PAYMENT_BUTTON || paymentState.isProcessing) return;
    
    goForward(STEP_INDEX_PAYMENT_PROCESSING);

    const result = await executePaymentFlow();
    if (result.success) return;

    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount((c) => c + 1);
      setTimeout(async () => {
        const retryResult = await executePaymentFlow();
        if (!retryResult.success) {
          handlePaymentError();
        }
      }, RETRY_DELAY_MS);
    } else {
      handlePaymentError();
    }
  }, [
    STEP_PAYMENT_BUTTON,
    paymentState.isProcessing,
    executePaymentFlow,
    retryCount,
    goForward,
    handlePaymentError,
  ]);

  const handlePaymentCancel = useCallback(async () => {
    await cancelPayment();
    handlePaymentError();
  }, [cancelPayment, handlePaymentError]);

  const handleRetryPayment = useCallback(async () => {
    await cancelPayment();
    setRetryCount(0);
    setTimeout(handlePaymentStart, PAYMENT_RESTART_DELAY_MS);
  }, [cancelPayment, handlePaymentStart]);

  const selectedOption = options.find((o) => o.selected);
  const showDoubleShot = selectedOption?.option === "mix";

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
        showDoubleShot={showDoubleShot}
      />

      {STEP_SERVICE_ANIMATION && (
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
