import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  PAYTER_API_KEY,
  PAYTER_URI,
  PAYTER_TERMINAL_SERIAL_NUMBER,
} = process.env;

if (!PAYTER_API_KEY || !PAYTER_URI || !PAYTER_TERMINAL_SERIAL_NUMBER) {
  throw new Error("Missing Payter environment variables");
}

const BASE_URL = `${PAYTER_URI}/terminals/${PAYTER_TERMINAL_SERIAL_NUMBER}`;

export const payterClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000, // 60s per request for slow connections
  headers: {
    Authorization: `CPS apikey="${PAYTER_API_KEY}"`,
    Accept: "*/*",
  },
  // Retry logic for network issues
  validateStatus: (status) => status >= 200 && status < 500,
});

/** Utility to unwrap data or throw with a uniform message */
async function unwrap<T>(
  promise: Promise<{ data: T; status: number }>,
  step: string
): Promise<T> {
  try {
    const res = await promise;
    if (res.status !== 200 && res.status !== 204) {
      throw new Error(`${step} failed: HTTP ${res.status}`);
    }
    return res.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(`${step} timed out - please check your internet connection`);
    }
    if (error.response) {
      throw new Error(`${step} failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`${step} failed: ${error.message}`);
  }
}

// ——————————————————————
// PAYTER SERVICE FUNCTIONS
// ——————————————————————

export async function checkTerminal(): Promise<{ online: boolean; state: string }> {
  return unwrap(payterClient.get(""), "Check terminal");
}

export async function startTerminal(authorizedAmount: number): Promise<void> {
  // returns empty body on success
  await unwrap(
    payterClient.post("start", null, { params: { authorizedAmount } }),
    "Start terminal"
  );
}

export async function readCard(waitTime = 10): Promise<any> {
  return unwrap(
    payterClient.get("card", { params: { waitTime } }),
    "Read card"
  );
}

export async function authorizeSession(): Promise<{
  sessionId: string;
  authorizedAmount: number;
}> {
  return unwrap(payterClient.post("authorize"), "Authorize session");
}

export async function commitSession(
  sessionId: string,
  commitAmount: number
): Promise<any> {
  return unwrap(
    payterClient.post(`sessions/${sessionId}/commit`, null, {
      params: {
        commitAmount,
        uiMessage: "Pago Aceptado",
        uiMessageTimeout: 1,
      },
    }),
    "Commit session"
  );
}

export async function cancelSession(
  sessionId: string,
  uiMessage = "Pago Cancelado",
  uiMessageTimeout = 3
): Promise<void> {
  await unwrap(
    payterClient.post(`sessions/${sessionId}/cancel`, null, {
      params: { uiMessage, uiMessageTimeout },
    }),
    "Cancel session"
  );
}

export async function stopTerminal(
  uiMessage = "Stopped",
  uiMessageTimeout = 30
): Promise<void> {
  await unwrap(
    payterClient.post("stop", null, { params: { uiMessage, uiMessageTimeout } }),
    "Stop terminal"
  );
}

// Helper function to safely stop terminal with retries
export async function safeStopTerminal(
  uiMessage = "Stopped",
  retries = 3
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await stopTerminal(uiMessage, 3);
      return;
    } catch (error: any) {
      if (i === retries - 1) {
        // Log but don't throw on final retry
        console.error('Failed to stop terminal after retries:', error.message);
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
