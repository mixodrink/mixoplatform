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
  timeout: 10_000, // 10s timeout general
  headers: {
    Authorization: `CPS apikey="${PAYTER_API_KEY}"`,
    Accept: "*/*",
  },
});

/** Utility to unwrap data or throw with a uniform message */
async function unwrap<T>(
  promise: Promise<{ data: T; status: number }>,
  step: string
): Promise<T> {
  const res = await promise;
  // Some Payter endpoints (e.g. start/stop) can return 204 No Content on success.
  // Treat any 2xx response as successful.
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`${step} failed: HTTP ${res.status}`);
  }
  return res.data;
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
    payterClient.post("start", null, {
      params: {
        authorizedAmount,
        hideAmount: false,
        uiMessage: "Approach Card Price:" + (authorizedAmount / 100).toFixed(2) + "€",
      },
    }),
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

export async function stopTerminal(
  uiMessage = "",
  uiMessageTimeout = 1
): Promise<void> {
  try {
    // Timeout corto para stop - si no responde rápido, asumir que se detuvo
    await Promise.race([
      unwrap(
        payterClient.post("stop", null, { 
          params: { uiMessage, uiMessageTimeout },
          timeout: 5_000 // 5s timeout específico para stop
        }),
        "Stop terminal"
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stop timeout')), 5_000)
      )
    ]);
  } catch (error: any) {
    // Si falla o timeout, no lanzar error - el terminal probablemente se detuvo
    console.warn(`⚠️ Stop terminal warning: ${error.message}`);
  }
}
