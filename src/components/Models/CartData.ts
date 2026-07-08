import { IProduct } from "../../types";

export class CartData {

  protected cartProducts: IProduct[];

  constructor(){
    this.cartProducts = [];
  }

  getCartProducts(): IProduct[] {
    return this.cartProducts;
  }

  addProduct(product: IProduct): void {
    this.cartProducts.push(product);
  }

  removeProduct(product: IProduct): void {
    this.cartProducts = this.cartProducts.filter(item => item !== product);
  }

  clearCart(): void {
    this.cartProducts = [];
  }

  getTotalPrice(): number {
    return this.cartProducts.reduce((acc: number, item: IProduct) => {
      if(item.price){acc += item.price;}
      return acc;
    }, 0);
  }

  getTotalNumber(): number {
    return this.cartProducts.length;
  }

  checkCartProduct(id: string): boolean {
    return this.cartProducts.some(item => item.id === id)
  }
}