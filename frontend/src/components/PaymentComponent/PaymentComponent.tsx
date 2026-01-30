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

  const executePaymentFlow = useCallback(async (attemptNumber: number = 0) => {
    const selected = options.find((o) => o.selected);
    if (!selected) return { success: false, error: "No option selected" };

    try {
      //  const drinkPrice = priceSum * 100;
      const drinkPrice = 5;
      const result = await startPaymentFlow(drinkPrice, attemptNumber); // Drink Pirce

      if (!result.success) {
        return { 
          success: false, 
          error: result.error,
          isCardReadError: result.isCardReadError 
        };
      }

      // Extract card data from payment flow response
      const cardData = result.data?.card;
      const cardId = cardData?.cardId || "UNKNOWN_CARD_ID";
      const cardNumber = cardData?.maskedPan || cardData?.cardNumber || "UNKNOWN_CARD_NUMBER";

      const base = {
        machineId: "650a0ab291e870d4bd7e5c85",
        paymentType: "Card",
        cardId,
        cardNumber,
      };

      let newDrink = (() => {
        if (selected.option === "mix") {
          return {
            ...base,
            type: "mix",
            drink: [mix.alcohol.name, mix.soft.name].filter(
              (d): d is string => d !== null
            ),
            price: mix.alcohol.price + mix.soft.price,
          };
        }
        if (selected.option === "soft") {
          return {
            ...base,
            type: "soft",  
            drink: [soft.drink.name].filter((d): d is string => d !== null),
            price: soft.drink.price,
          };
        }
        if (selected.option === "water") {
          return {
            ...base,
            type: "water",
            drink: [water.drink.name].filter((d): d is string => d !== null),
            price: water.drink.price,
          };
        }
        return null;
      })();

      if (!newDrink) {
        return { success: false, error: "Invalid drink config" };
      }

      // Create the drink locally
      await createDrink(newDrink);

      // Create cloud service data from the local drink
      const cloudServiceData: PostServiceEC2Cloud = {
        machineId: "6848b4755ab63433867d81a0",
        type: newDrink.type,
        alcohol: newDrink.type === "mix" ? newDrink.drink[0] : undefined ,
        bib: newDrink.type === "soft" || newDrink.type === "water" ? newDrink.drink[0] : newDrink.drink[1],
        price: newDrink.price,
        paymentType: newDrink.paymentType,
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
      goForward(6);
      setRetryCount(0);
      return { success: true, isCardReadError: false };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        isCardReadError: false,
      };
    }
  }, [options, mix, soft, water, priceSum, startPaymentFlow, goForward]);

  const handlePaymentStart = useCallback(async () => {
    if (!STEP_4 || paymentState.isProcessing) return;
    
    // Only advance step if we're not already processing
    if (paymentState.currentStep === 'idle') {
      goForward(5);
    }

    const result = await executePaymentFlow(0);
    if (result.success) return;

    // Si falla la lectura de tarjeta, reintentamos sin mostrar error
    if (result.isCardReadError && retryCount < 1) {
      setRetryCount((c) => c + 1);
      console.log('Card read failed, retrying...');
      // El reintento se maneja automáticamente con la barra de progreso
      setTimeout(async () => {
        const retry = await executePaymentFlow(1);
        if (!retry.success) {
          console.log('Retry failed, closing payment silently');
          // Cerrar sin mostrar mensaje de error
          paymentClose();
          goBack(1);
          setRetryCount(0);
        }
      }, 500);
    } else if (result.isCardReadError) {
      console.log('Max retries reached, closing payment');
      // Cerrar sin mostrar mensaje de error
      paymentClose();
      goBack(1);
      setRetryCount(0);
    }
    // Si no es error de lectura de tarjeta, el estado 'error' ya se mostró
  }, [
    STEP_4,
    paymentState.isProcessing,
    paymentState.currentStep,
    executePaymentFlow,
    retryCount,
    goForward,
    paymentClose,
    goBack,
  ]);

  const handlePaymentCancel = useCallback(async () => {
    try {
      await cancelPayment();
    } catch (error) {
      console.error('Error during payment cancellation:', error);
    } finally {
      handlePaymentError();
    }
  }, [cancelPayment, handlePaymentError]);

  const handleCardReadTimeout = useCallback(async () => {
    console.log('Card read timeout, attempting retry...');
    // El componente ya ha mostrado la barra completa, ahora reiniciamos
  }, []);

  const handleRetryPayment = useCallback(async () => {
    try {
      // Cancel any existing payment state
      await cancelPayment();
      setRetryCount(0);
      // Give a moment for cleanup before starting new payment
      setTimeout(handlePaymentStart, 500);
    } catch (error) {
      console.error('Error during retry preparation:', error);
      // Still try to start payment even if cancel failed
      setRetryCount(0);
      setTimeout(handlePaymentStart, 500);
    }
  }, [cancelPayment, handlePaymentStart]);

  return (
    <>
      <PaymentOverlayContainer>
        {paymentState.currentStep === "reading-card" && (
          <PaymentReadComponent 
            cardImageSrc={card} 
            waitTime={10}
            onTimeout={handleCardReadTimeout}
            retryAttempt={paymentState.retryAttempt}
          />
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
            errorMessage={paymentState.error || undefined}
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
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
`;

export default PaymentComponent;
