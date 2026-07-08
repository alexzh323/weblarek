import { IProduct } from "../../types";

export class CartData {

  protected _cartProducts: IProduct[];

  constructor(){
    this._cartProducts = [];
  }

  getCartProducts(): IProduct[] {
    return this._cartProducts;
  }
  addProduct(product: IProduct): void {
    this._cartProducts.push(product);
  }
  removeProduct(product: IProduct): void {
    this._cartProducts = this._cartProducts.filter(item => item !== product);
  }
  clearCart(): void {
    this._cartProducts = [];
  }
  getTotalPrice(): number {
    return this._cartProducts.reduce((acc: number, item: IProduct) => {
      if(item.price){acc += item.price};
      return acc;
    }, 0);
  }
  getTotalNumber(): number {
    return this._cartProducts.length;
  }
  checkCartProduct(id: string): boolean {
    if(this._cartProducts.find(item => item.id === id)) {
      return true;
    } else{
      return false;
    }
  }
}