interface Drink {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  price: number;
}

export interface OptionListInterface {
  obj: Record<string, Drink>;
  selected: boolean;
  transitionEnd: boolean;
  slideIn: boolean;
  slideOut: boolean;
  type?: string;
}
