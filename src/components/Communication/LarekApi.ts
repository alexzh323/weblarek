import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class LarekApi {
  
  protected api: IApi;
  
  constructor(api: IApi) {
    this.api  = api;
  }

  getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/")
    .then((data) => {
        const updatedItems = data.items.map(item => ({
          ...item,
          image: CDN_URL + item.image
        }))
        return {
          ...data,
          items: updatedItems
        };
      });
  }

  orderProducts(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}