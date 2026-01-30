import { Request, Response } from "express";
import logger from "../middlewares/logger";
import {
  checkTerminal,
  startTerminal,
  readCard,
  authorizeSession,
  commitSession,
  cancelSession,
  safeStopTerminal,
} from "../services/payment.service";

interface PaymentError extends Error {
  response?: any;
  request?: any;
}

interface PaymentResult {
  terminal?: any;
  start?: any;
  card?: any;
  authorization?: any;
  commit?: any;
}

// 1️⃣ CHECK TERMINAL FUNCTION
const handleCheckTerminal = async (): Promise<any> => {
  logger.info("🔄 Checking terminal state");
  const terminal = await checkTerminal();
  
  if (!terminal?.online || terminal.state !== "IDLE") {
    logger.warn("⚠️ Terminal unavailable", terminal);
    throw new Error("Terminal is not IDLE or offline. Please try again shortly.");
  }
  
  return terminal;
};

// 2️⃣ START TERMINAL FUNCTION
const handleStartTerminal = async (authorizedAmount: number): Promise<any> => {
  logger.info("✅ Terminal is ready, starting payment");
  return await startTerminal(authorizedAmount);
};

// 3️⃣ READ CARD FUNCTION
const handleReadCard = async (): Promise<any> => {
  logger.info("💳 Waiting for card");
  const cardData = await readCard();
  logger.info("✅ Card read raw response:", JSON.stringify(cardData));
  return cardData;
};

// 4️⃣ VALIDATE CARD DATA FUNCTION
const validateCardData = (cardData: any, res: Response): boolean => {
  if (!cardData || !cardData.cardId || !cardData.maskedPan) {
    logger.error("❌ Invalid card data", cardData);
    res.status(422).json({
      error: true,
      step: "read-card",
      message: "Invalid card data received.",
    });
    return false;
  }
  return true;
};

// 5️⃣ AUTHORIZE SESSION FUNCTION
const handleAuthorizeSession = async (): Promise<any> => {
  logger.info("🔐 Authorizing payment");
  return await authorizeSession();
};

// 6️⃣ VALIDATE AUTHORIZATION RESPONSE FUNCTION
const validateAuthResponse = (authResp: any, res: Response): boolean => {
  if (!authResp || !authResp.sessionId || !authResp.authorizedAmount) {
    logger.error("❌ Invalid authorization response", authResp);
    res.status(422).json({
      error: true,
      step: "commit-session",
      message: "Invalid authorization response.",
    });
    return false;
  }

  if (!authResp?.sessionId || !authResp.authorizedAmount) {
    logger.error("❌ Missing sessionId or authorizedAmount in authorization response", authResp);
    res.status(400).json({
      error: true,
      step: "commit-session",
      message: "Missing sessionId or authorizedAmount in authorization response.",
    });
    return false;
  }
  
  return true;
};

// 7️⃣ COMMIT SESSION FUNCTION
const handleCommitSession = async (sessionId: string, authorizedAmount: number): Promise<any> => {
  logger.info(`📦 Committing session ${sessionId}`);
  const commitData = await commitSession(sessionId, authorizedAmount);
  logger.info("✅ Payment committed");
  return commitData;
};

// 8️⃣ VALIDATE INPUT FUNCTION
const validateInput = (authorizedAmount: any, res: Response): boolean => {
  if (typeof authorizedAmount !== "number" || authorizedAmount <= 0) {
    res.status(422).json({
      error: true,
      step: "validate-input",
      message: "Invalid authorizedAmount; must be a positive number.",
    });
    return false;
  }
  return true;
};

// SEPARATE ENDPOINTS FOR EACH STEP

// 🔄 CHECK TERMINAL ENDPOINT
export const checkPaymentTerminal = async (req: Request, res: Response): Promise<void> => {
  try {
    const terminal = await handleCheckTerminal();
    res.status(200).json({
      success: true,
      step: "check-terminal",
      data: terminal,
    });
  } catch (err: any) {
    logger.error("❌ Failed to check terminal", err);
    res.status(422).json({
      error: true,
      step: "check-terminal",
      message: err.message || "Failed to reach terminal.",
    });
  }
};

// ✅ START TERMINAL ENDPOINT
export const startPaymentTerminal = async (req: Request, res: Response): Promise<void> => {
  const { authorizedAmount } = req.body;
  
  if (!validateInput(authorizedAmount, res)) return;

  try {
    const startResp = await handleStartTerminal(authorizedAmount);
    res.status(200).json({
      success: true,
      step: "start-terminal",
      data: startResp,
    });
  } catch (err: any) {
    logger.error("❌ Failed to start terminal", err);
    // cleanup with safe retry
    try {
      await safeStopTerminal("Error on startTerminal");
    } catch {
      /* ignore */
    }
    res.status(422).json({
      error: true,
      step: "start-terminal",
      message: err.message || "Could not initiate payment on terminal.",
    });
  }
};

// 💳 READ CARD ENDPOINT
export const readPaymentCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const cardData = await handleReadCard();
    res.status(200).json({
      success: true,
      step: "read-card",
      data: cardData,
    });
  } catch (err: any) {
    logger.error("❌ Failed to read card", err);

    // Log detailed API error information
    if (err.response) {
      logger.error("API Response Error:", {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        headers: err.response.headers,
      });
    } else if (err.request) {
      logger.error("API Request Error (no response):", err.message);
    } else {
      logger.error("API Setup Error:", err.message);
    }

    try {
      await safeStopTerminal("Error on readCard");
    } catch {
      /* ignore */
    }

    res.status(422).json({
      error: true,
      step: "read-card",
      message: err.message || "Could not read card.",
      apiError: {
        status: err.message?.status,
        statusText: err.message?.statusText,
        data: err.message?.data,
        originalMessage: err.message,
      },
    });
  }
};

// 🔐 AUTHORIZE SESSION ENDPOINT
export const authorizePaymentSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const authResp = await handleAuthorizeSession();
    
    if (!validateAuthResponse(authResp, res)) return;
    
    res.status(200).json({
      success: true,
      step: "authorize-session",
      data: authResp,
    });
  } catch (err: any) {
    logger.error("❌ Authorization failed", err);
    try {
      await safeStopTerminal("Error on authorizeSession");
    } catch {
      /* ignore */
    }
    res.status(422).json({
      error: true,
      step: "authorize-session",
      message: err.message || "Authorization failed.",
    });
  }
};

// 📦 COMMIT SESSION ENDPOINT
export const commitPaymentSession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, authorizedAmount } = req.body;
  
  if (!sessionId || !authorizedAmount) {
    res.status(400).json({
      error: true,
      step: "commit-session",
      message: "Missing sessionId or authorizedAmount.",
    });
    return;
  }

  try {
    const commitData = await handleCommitSession(sessionId, authorizedAmount);
    res.status(200).json({
      success: true,
      step: "commit-session",
      data: commitData,
    });
  } catch (err: any) {
    logger.error("❌ Commit failed", err);
    try {
      await safeStopTerminal("Error on commitSession");
    } catch {
      /* ignore */
    }
    res.status(500).json({
      error: true,
      step: "commit-session",
      message: err.message || "Could not commit payment.",
    });
  }
};

// MAIN PAYMENT CONTROLLER (for full flow if still needed)
export const startPayment = async (req: Request, res: Response): Promise<void> => {
  const { authorizedAmount } = req.body;
  
  // Validate input
  if (!validateInput(authorizedAmount, res)) return;

  try {
    // Execute payment flow
    const terminal = await handleCheckTerminal();
    const startResp = await handleStartTerminal(authorizedAmount);
    const cardData = await handleReadCard();
    
    if (!validateCardData(cardData, res)) return;

    const authResp = await handleAuthorizeSession();
    
    if (!validateAuthResponse(authResp, res)) return;

    const commitData = await handleCommitSession(authResp.sessionId, authResp.authorizedAmount);

    // 🎉 ALL DONE: Return everything
    res.json({
      terminal,
      start: startResp,
      card: cardData,
      authorization: authResp,
      commit: commitData,
    });
  } catch (err: any) {
    logger.error("❌ Payment flow failed", err);
    try {
      await safeStopTerminal("Error in payment flow");
    } catch {
      /* ignore */
    }
    res.status(500).json({
      error: true,
      message: err.message || "Payment flow failed.",
    });
  }
};

export const stopPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;
    
    // If there's an active session, cancel it first
    if (sessionId) {
      try {
        logger.info(`🚫 Cancelling active session: ${sessionId}`);
        await cancelSession(sessionId, "Pago Cancelado", 3);
        logger.info("✅ Session cancelled successfully");
      } catch (cancelErr: any) {
        logger.warn("⚠️ Failed to cancel session, attempting to stop terminal anyway", cancelErr.message);
      }
    }
    
    // Always try to stop the terminal
    await safeStopTerminal("Operación Cancelada");
    
    res.json({ 
      success: true,
      message: "Payment stopped successfully",
      sessionCancelled: !!sessionId 
    });
  } catch (err: any) {
    logger.error("❌ Stopping payment error", err);
    res.status(500).json({ 
      error: true, 
      message: err.message || "Failed to stop payment" 
    });
  }
};

// 🚫 CANCEL SESSION ENDPOINT
export const cancelPaymentSession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    res.status(400).json({
      error: true,
      message: "Missing sessionId",
    });
    return;
  }

  try {
    logger.info(`🚫 Cancelling session: ${sessionId}`);
    await cancelSession(sessionId, "Pago Cancelado", 3);
    
    // Also stop the terminal after cancelling
    await safeStopTerminal("Operación Cancelada");
    
    res.status(200).json({
      success: true,
      message: "Session cancelled successfully",
    });
  } catch (err: any) {
    logger.error("❌ Cancel session failed", err);
    
    // Try to stop terminal anyway
    try {
      await safeStopTerminal("Error");
    } catch {}
    
    res.status(500).json({
      error: true,
      message: err.message || "Could not cancel session.",
    });
  }
};
