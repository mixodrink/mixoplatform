
export enum PaymentType {
  CARD,
  NFC,
}

export enum ServiceType {
  MIX,
  WATER,
  BIB,
}
interface Drink {
  machineId: string;
  type: ServiceType;
  drink: string[];
  paymentType: PaymentType;
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
