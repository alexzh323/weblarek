import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";
import {  ICardActions } from "../../types";


interface ICardBasket extends ICard { 
  index: number; 
} 

export class CardBasket extends Card<ICardBasket> {

  protected basketItemIndex: HTMLElement;
  protected basketDeleteItemButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.basketItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.basketDeleteItemButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if(actions?.onClick){
      this.basketDeleteItemButtonElement.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.basketItemIndex.textContent = String(value);
  }
}