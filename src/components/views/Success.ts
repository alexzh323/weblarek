import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  total: number; 
}

export class Success extends Component<ISuccess> {

  protected successTotalField: HTMLElement;
  protected successCloseButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.successTotalField = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successCloseButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successCloseButton.addEventListener('click', () => {
      this.events.emit('order:success');
    })
  }

  set total(value: number) {
    this.successTotalField.textContent = `Списано ${value} синапсов`
  }
}