import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard 
{ title: string; 
  price: number | null
}

export abstract class Card<T extends ICard> extends Component<T> {
  
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement('.card__title', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
  }

  set title(value:string) {
    this.titleElement.textContent = value;
  }

  set price(value: number|null) {
    (value)
      ? this.priceElement.textContent = `${value} синапсов`
      : this.priceElement.textContent = 'Бесценно'
  }
}
