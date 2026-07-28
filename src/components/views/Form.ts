import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IFormState {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IFormState> extends Component<T> {

  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${container.name}.${field}:change`, {value});
    })

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    })
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}