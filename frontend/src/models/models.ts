interface DrinkModel {
  type: string;
  drink: {
    itemM: string;
    itemS?: string;
  };
  price: number;
}

interface AuthToken {
  token: string;
  refreshToken: string;
}

interface User {
  email: string;
  password: string;
}

export type { DrinkModel, AuthToken, User };
