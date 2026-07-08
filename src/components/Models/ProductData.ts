import { IProduct } from "../../types"

export class ProductData  {
  protected products: IProduct[];
  protected currentProduct: IProduct | null;
  
  constructor(){
    this.products = [];
    this.currentProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[]{
    return this.products;
  }

  getProduct(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  }

  setCurrentProduct(product: IProduct): void {
    this.currentProduct = product;
  }

  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}