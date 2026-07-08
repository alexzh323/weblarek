import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';

export class LarekApi {
  protected _api: IApi;
  constructor(api: IApi) {
    this._api  = api;
  }
  getProductList(): Promise<IProductListResponse> {
    return this._api.get<IProductListResponse>("/product/");
  }
  orderProducts(order: IOrderRequest): Promise<IOrderResponse> {
    return  this._api.post<IOrderResponse>("/order/", order);
  }
}