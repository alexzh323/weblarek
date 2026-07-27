import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket { 
  catalog: HTMLElement[]; 
  total: number;
}

export class Basket extends Component<IBasket> {

  protected basketCatalogField: HTMLElement;
  protected basketTotal: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.basketCatalogField = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketTotal = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:start');
    });
  }

  set catalog(value: HTMLElement[]) {
    this.basketCatalogField.replaceChildren(...value);
  }

  set total(value:number) {
    this.basketTotal.textContent = `${value} синапсов`
  }
}