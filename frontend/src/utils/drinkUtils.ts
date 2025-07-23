// utils/drinkUtils.ts

interface DrinkSelection {
  alcohol: { name: string | null; price: number };
  soft: { name: string | null; price: number };
}

interface SingleDrinkSelection {
  drink: { name: string | null; price: number };
}

interface SelectedOption {
  option: 'mix' | 'soft' | 'water';
  selected: boolean;
}

interface DrinkData {
  machineId: string;
  type: string;
  drink: string[];
  paymentType: string;
  price: number;
  cardId: string;
  cardNumber: string;
}

export const createDrinkData = (
  selectedOption: SelectedOption,
  mix: DrinkSelection,
  soft: SingleDrinkSelection,
  water: SingleDrinkSelection
): DrinkData | null => {
  const baseData = {
    machineId: '12I72P128391H8120D01291JS1',
    paymentType: "card",
    cardId: 'AB12HDB293SN02',
    cardNumber: '1234567890123456',
  };

  switch (selectedOption.option) {
    case 'mix':
      return {
        ...baseData,
        type: "mix",
        drink: [mix.alcohol.name, mix.soft.name].filter((d): d is string => d !== null),
        price: mix.alcohol.price + mix.soft.price,
      };

    case 'soft':
      return {
        ...baseData,
        type: "soft",
        drink: [soft.drink.name].filter((d): d is string => d !== null),
        price: soft.drink.price,
      };

    case 'water':
      return {
        ...baseData,
        type: "water",
        drink: [water.drink.name].filter((d): d is string => d !== null),
        price: water.drink.price,
      };

    default:
      return null;
  }
};
