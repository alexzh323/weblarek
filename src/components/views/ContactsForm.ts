import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IFormState } from "./Form";

interface IContactsForm extends IFormState {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {

  protected emailField: HTMLInputElement;
  protected phoneField: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.submitButton.textContent = 'Оплатить';
    this.emailField = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this.phoneField = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
  }

  set email(value: string) {
    this.emailField.value = value;
  }

  set phone(value: string) {
    this.phoneField.value = value;
  }
}