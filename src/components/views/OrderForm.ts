import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IFormState } from "./Form";
import { TPayment } from "../../types";

interface IOrderForm extends IFormState {
  address: string;
  payment: TPayment | null;
}

export class OrderForm extends Form<IOrderForm> {

  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressField: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
    this.addressField = ensureElement<HTMLInputElement>('[name="address"]',this.container)
    this.submitButton.textContent = "Далее";

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { value: 'card' });
    })

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { value: 'cash' });
    })
  }

  set address(value: string) {
    this.addressField.value = value;
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }
}