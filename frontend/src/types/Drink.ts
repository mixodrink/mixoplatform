export type Beverage =
  | {
      type: string;
      alcohol: [string, string, string, string];
      soda: [string, string, string, string, string];
    }
  | { type: string; soda: [string, string, string, string, string] }
  | { type: string; water: [string] };

export type Alcohol = {
  type: 'alcohol';
  alcohol: [string, string, string, string];
  soda: [string, string, string, string, string];
};

export type Soda = {
  type: 'soda';
  soda: [string, string, string, string, string];
};

export type Water = {
  type: 'water';
  water: string[];
};
