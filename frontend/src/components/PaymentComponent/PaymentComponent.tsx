import React, { useCallback, useState, useEffect } from "react";
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
import { nodeRedStartService } from "api/local/node-red";
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
  const { mix, soft, water, shot } = useDrinkSelection();
  const { paymentState, startPaymentFlow, cancelPayment } = usePaymentFlow();
  const [retryCount, setRetryCount] = useState(0);
  const cloudMachineId = import.meta.env.VITE_CLOUD_MACHINE_ID;
  // Ref para guardar el timeout del retry
  const retryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Flag para saber si se canceló
  const isCancelledRef = React.useRef(false);

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
    if (!cloudMachineId) {
      return { success: false, error: "Missing VITE_CLOUD_MACHINE_ID" };
    }

      try {
        // priceSum already reflects any double-shot surcharge (store / UI logic applies it).
        // const drinkPrice = Math.round(priceSum * 100);
        const drinkPrice = 5;
        const result = await startPaymentFlow(drinkPrice); // Drink Price in cents

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Extract card data from payment flow response
      const cardData = result.data?.card;
      const cardId = cardData?.cardId || "UNKNOWN_CARD_ID";
      const cardNumber = cardData?.maskedPan || cardData?.cardNumber || "UNKNOWN_CARD_NUMBER";

      const base = {
        machineId: cloudMachineId,
        paymentType: "Card",
        cardId,
        cardNumber,
      };

      // read doubleShot flag from localStorage (default false)
      let doubleShotFlag = false;
      try {
        doubleShotFlag = localStorage.getItem('doubleShot') === 'true';
      } catch (e) {
        doubleShotFlag = false;
      }

      const isMixLikeOption = selected.option === "mix" || selected.option === "mojito";

      let newDrink = (() => {
        if (isMixLikeOption) {
          return {
            ...base,
            type: "mix",
            drink: [mix.alcohol.name, mix.soft.name].filter(
              (d): d is string => d !== null
            ),
            // use priceSum passed from UI/store which already includes double-shot
            price: priceSum,
            doubleShot: selected.option === "mix" ? doubleShotFlag : false,
          };
        }
        if (selected.option === "soft") {
          return {
            ...base,
            type: "soft",
            drink: [soft.drink.name].filter((d): d is string => d !== null),
            price: priceSum,
          };
        }
        if (selected.option === "water") {
          return {
            ...base,
            type: "water",
            drink: [water.drink.name].filter((d): d is string => d !== null),
            price: priceSum,
          };
        }
        if (selected.option === "shot") {
          return {
            ...base,
            type: "shot",
            drink: [shot.drink.name].filter((d): d is string => d !== null),
            price: priceSum,
          };
        }
        return null;
      })();

      if (!newDrink) {
        return { success: false, error: "Invalid drink config" };
      }

      // Create cloud service data from the payment result
      const cloudServiceData: PostServiceEC2Cloud = {
        machineId: cloudMachineId,
        type: newDrink.type,
        alcohol: newDrink.type === "mix" || newDrink.type === "shot" ? newDrink.drink[0] : undefined ,
        bib: newDrink.type === "soft" || newDrink.type === "water" ? newDrink.drink[0] : newDrink.type === "mix" ? newDrink.drink[1] : undefined,
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
        console.warn('Failed to create cloud service (continuing with service start):', cloudError);
      }

      await nodeRedStartService(newDrink);
      goForward(6);
      setRetryCount(0);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }, [cloudMachineId, options, mix, soft, water, priceSum, startPaymentFlow, goForward]);

  const handlePaymentStart = useCallback(async () => {
    if (!STEP_4 || paymentState.isProcessing) return;
    
    // Reset de flag de cancelación
    isCancelledRef.current = false;
    goForward(5);

    const result = await executePaymentFlow();
    
    // Verificar si se canceló durante el flujo
    if (isCancelledRef.current) {
      console.log('Payment cancelled, skipping retry');
      return;
    }
    
    if (result.success) return;

    if (retryCount < 1) {
      setRetryCount((c) => c + 1);
      
      // Guardar el timeout para poder cancelarlo
      retryTimeoutRef.current = setTimeout(async () => {
        // Verificar nuevamente si se canceló antes de reintentar
        if (isCancelledRef.current) {
          console.log('Retry cancelled');
          return;
        }
        
        const retry = await executePaymentFlow();
        if (!retry.success && !isCancelledRef.current) {
          handlePaymentError();
        }
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
    // Marcar como cancelado INMEDIATAMENTE
    isCancelledRef.current = true;
    
    // Cancelar cualquier retry pendiente
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    await cancelPayment();
    handlePaymentError();
  }, [cancelPayment, handlePaymentError]);

  const handleRetryPayment = useCallback(async () => {
    // Cancelar cualquier timeout pendiente
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    await cancelPayment();
    setRetryCount(0);
    isCancelledRef.current = false;
    setTimeout(handlePaymentStart, 500);
  }, [cancelPayment, handlePaymentStart]);

  // Cleanup: cancelar timeouts cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Marcar como cancelado
      isCancelledRef.current = true;
      
      // Limpiar timeout pendiente
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

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

      {/* showDoubleShot only when selected option is 'mix' (alcohol) */}
      <PayButtonComponent
        price={priceSum}
        animateShow={animateShow}
        variant={variant}
        onPaymentClick={handlePaymentStart}
        disabled={
          paymentState.isProcessing || paymentState.currentStep === "error"
        }
        showDoubleShot={options.find((o) => o.selected)?.option === 'mix'}
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
