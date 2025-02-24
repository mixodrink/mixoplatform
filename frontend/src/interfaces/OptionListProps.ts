export interface OptionListProps {
  type: string;
  obj: { drink: { title: string; image: { src: string; alt: string }; price: number } };
  selected: boolean;
  transitionEnd: boolean;
  slide: boolean;
}
