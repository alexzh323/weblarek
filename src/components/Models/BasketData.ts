import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketData {

  protected basketProducts: IProduct[];

  constructor(protected events: IEvents){
    this.basketProducts = [];
  }

  getBasketProducts(): IProduct[] {
    return this.basketProducts;
  }

  addProduct(product: IProduct): void {
    this.basketProducts.push(product);
    this.events.emit('basket:changed');
  }

  removeProduct(product: IProduct): void {
    this.basketProducts = this.basketProducts.filter(item => item !== product);
    this.events.emit('basket:changed');
  }

  clearBasket(): void {
    this.basketProducts = [];
    this.events.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.basketProducts.reduce((acc: number, item: IProduct) => {
      if(item.price){acc += item.price;}
      return acc;
    }, 0);
  }

  getTotalNumber(): number {
    return this.basketProducts.length;
  }

  checkBasketProduct(id: string): boolean {
    return this.basketProducts.some(item => item.id === id)
  }
}