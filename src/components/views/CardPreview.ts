import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IProduct, CategoryKey, ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";

type ICardPreview = Pick<IProduct, 'description'| 'title' | 'price' | 'category' | 'image'>



export class CardPreview extends Card<ICardPreview> {

  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement
  protected textElement: HTMLElement;
  protected cardButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if(actions?.onClick){
      this.cardButtonElement.addEventListener('click', actions.onClick);
    }
  }

  set description(value: string) {
    this.textElement.textContent = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for(const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value:string){
    this.setImage(this.imageElement, value, this.titleElement.textContent);
  }  

  set disabled(value: boolean) {
    this.cardButtonElement.disabled = value;
  }
}