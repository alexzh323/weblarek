import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal { 
  content: HTMLElement; 
}

export class Modal extends Component<IModal> {

  protected modalField: HTMLElement;
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.modalField =ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.close()
    })

    this.container.addEventListener('click', () => {
      this.close()
    })

    this.modalContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  set content(value: HTMLElement) {
    this.modalField.replaceChildren(value);
  }

  open(){
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(){
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}