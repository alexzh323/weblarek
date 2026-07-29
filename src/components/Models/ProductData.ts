import { IProduct } from "../../types"
import { IEvents } from "../base/Events";

export class ProductData  {
  protected products: IProduct[];
  protected currentProduct: IProduct | null;
  
  constructor(protected events: IEvents){
    this.products = [];
    this.currentProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[]{
    return this.products;
  }

  getProduct(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  }

  setCurrentProduct(product: IProduct): void {
    this.currentProduct = product;
    this.events.emit('card:preview', product);
  }

  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}