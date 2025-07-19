import { Request, Response } from "express";
import logger from "../middlewares/logger";
import {
  checkTerminal,
  startTerminal,
  readCard,
  authorizeSession,
  commitSession,
  stopTerminal,
} from "../services/payment.service";

export const startPayment = async (req: Request, res: Response): Promise<void> => {
  const { authorizedAmount } = req.body;
  if (typeof authorizedAmount !== "number" || authorizedAmount <= 0) {
    res.status(400).json({
      error: true,
      step: "validate-input",
      message: "Invalid authorizedAmount; must be a positive number.",
    });
  }

  // 1️⃣ CHECK TERMINAL
  let terminal;
  try {
    logger.info("🔄 Checking terminal state");
    terminal = await checkTerminal();
  } catch (err: any) {
    logger.error("❌ Failed to check terminal", err);
    res.status(500).json({
      error: true,
      step: "check-terminal",
      message: err.message || "Failed to reach terminal.",
    });
  }

  if (!terminal?.online || terminal.state !== "IDLE") {
    logger.warn("⚠️ Terminal unavailable", terminal);
    res.status(423).json({
      error: true,
      step: "check-terminal",
      message: "Terminal is not IDLE or offline. Please try again shortly.",
      details: terminal,
    });
  }

  // 2️⃣ START TERMINAL
  let startResp;
  try {
    logger.info("✅ Terminal is ready, starting payment");
    startResp = await startTerminal(authorizedAmount);
  } catch (err: any) {
    logger.error("❌ Failed to start terminal", err);
    // cleanup
    try {
      await stopTerminal("Error on startTerminal", 30);
    } catch {
      /* ignore */
    }
    res.status(500).json({
      error: true,
      step: "start-terminal",
      message: err.message || "Could not initiate payment on terminal.",
    });
  }

  // 3️⃣ READ CARD
  let cardData;
  try {
    logger.info("💳 Waiting for card");
    cardData = await readCard();
    logger.info("✅ Card read raw response:", JSON.stringify(cardData));
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
      await stopTerminal("Error on readCard", 30);
    } catch {
      /* ignore */
    }

    res.status(400).json({
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

  // 4️⃣ AUTHORIZE SESSION
  if (!cardData || !cardData.cardId || !cardData.maskedPan) {
    logger.error("❌ Invalid card data", cardData);
    res.status(500).json({
      error: true,
      step: "read-card",
      message: "Invalid card data received.",
    });
  }

  let authResp;
  try {
    logger.info("🔐 Authorizing payment");
    authResp = await authorizeSession();
  } catch (err: any) {
    logger.error("❌ Authorization failed", err);
    try {
      await stopTerminal("Error on authorizeSession", 30);
    } catch {
      /* ignore */
    }
    res.status(500).json({
      error: true,
      step: "authorize-session",
      message: err.message || "Authorization failed.",
    });
  }

  // 5️⃣ COMMIT SESSION
  if (!authResp || !authResp.sessionId || !authResp.authorizedAmount) {
    logger.error("❌ Invalid authorization response", authResp);
    res.status(500).json({
      error: true,
      step: "commit-session",
      message: "Invalid authorization response.",
    });
  }

  if (!authResp?.sessionId || !authResp.authorizedAmount) {
    logger.error("❌ Missing sessionId or authorizedAmount in authorization response", authResp);
    res.status(500).json({
      error: true,
      step: "commit-session",
      message: "Missing sessionId or authorizedAmount in authorization response.",
    });
    return;
  }

  let commitData;
  try {
    logger.info(`📦 Committing session ${authResp.sessionId}`);
    commitData = await commitSession(authResp.sessionId, authResp.authorizedAmount);
    logger.info("✅ Payment committed");
  } catch (err: any) {
    logger.error("❌ Commit failed", err);
    try {
      await stopTerminal("Error on commitSession", 30);
    } catch {
      /* ignore */
    }
    res.status(500).json({
      error: true,
      step: "commit-session",
      message: err.message || "Could not commit payment.",
    });
  }

  // 🎉 ALL DONE:  everything
  res.json({
    terminal,
    start: startResp,
    card: cardData,
    authorization: authResp,
    commit: commitData,
  });
};

export const stopPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    await stopTerminal();
    res.json({ message: "Payment stopped successfully" });
  } catch (err: any) {
    logger.error("❌ Stopping payment error", err);
    res.status(500).json({ error: true, message: err.message || "Unexpected error" });
  }
};


// src/controllers/paymentController.ts
// import { Request, Response } from "express";
// import logger from "../middlewares/logger";

// export const startPayment = async (req: Request, res: Response): Promise<void> => {
//   const { authorizedAmount } = req.body;
//   if (typeof authorizedAmount !== "number" || authorizedAmount <= 0) {
//     res.status(400).json({ error: true, message: "Invalid authorizedAmount" });
//   }

//   logger.info("🔄 (MOCK) Starting fake payment flow");

//   // Simulate some processing delay
//   await new Promise((r) => setTimeout(r, 500));

//   const fakeSessionId = "MOCK_SESSION_12345";
//   const fakeCommitAmount = authorizedAmount;

//   logger.info(`✅ (MOCK) Payment committed for session ${fakeSessionId}`);

//   //  the shape your frontend expects
//   res.status(200).json({
//     sessionId: fakeSessionId,
//     authorizedAmount,
//     commitAmount: fakeCommitAmount,
//     status: "committed",
//     cardInfo: { cardId: "MOCK_CARD", maskedNumber: "**** **** **** 4242" },
//     meta: { note: "This is a mocked response" },
//   });
// };

// export const stopPayment = async (req: Request, res: Response): Promise<void> => {
//   logger.info("🔄 (MOCK) Stopping fake payment");
//   // Simulate immediate success
//   res.status(200).json({ message: "Payment stopped successfully (mock)" });
// };
