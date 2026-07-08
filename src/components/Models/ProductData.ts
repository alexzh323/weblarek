import { IProduct } from "../../types"

export class ProductData  {
  protected _products: IProduct[];
  protected _currentProduct: IProduct | null;
  
  constructor(){
    this._products = [];
    this._currentProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this._products = products;
  }
  getProducts(): IProduct[]{
    return  this._products;
  }
  getProduct(id: string): IProduct | null {
    return this._products.find(product => product.id === id) || null;
  }
  setCurrentProduct(product: IProduct): void {
    this._currentProduct = product;
  }
  getCurrentProduct(): IProduct | null {
    return this._currentProduct;
  }
}