interface Drink {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  price: number;
}

export interface OptionListInterface {
  type?: string;
  obj: Record<string, Drink>;
  selected: boolean;
  transitionEnd: boolean;
  slideIn: boolean;
  slideOut: boolean;
}
