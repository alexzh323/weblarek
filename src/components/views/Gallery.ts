import { Component } from "../base/Component";

interface IGallery { 
  catalog: HTMLElement[]; 
}

export class Gallery extends Component<IGallery> {

  protected catalogField: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogField = this.container;
  }

  set catalog(value: HTMLElement[]){
    this.catalogField.replaceChildren(...value);
  }
}