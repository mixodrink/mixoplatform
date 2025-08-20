
export enum PaymentType {
  CARD,
  NFC,
}

export enum ServiceType {
  MIX,
  WATER,
  SOFT,
}
interface Drink {
  machineId: string;
  type: string;
  drink: string[];
  paymentType: string;
  price: number;
  cardId: string;
  cardNumber: string;
}

interface AuthToken {
  token: string;
  refreshToken: string;
}

interface User {
  email: string;
  password: string;
}

export type { Drink, AuthToken, User };
