import './scss/styles.scss';
import { CartData } from './components/Models/CartData';
import { ProductData } from './components/Models/ProductData';
import { OrderData } from './components/Models/OrderData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { LarekApi } from './components/Communication/LarekApi';
import { API_URL } from './utils/constants'

const testProductData = new ProductData();
const testCartData = new CartData();
const testOrderData = new OrderData();

console.log("ТОВАРЫ")
console.log(`все товары(пусто):`, testProductData.getProducts());
testProductData.setProducts(apiProducts.items);
console.log(`все товары:`, testProductData.getProducts()); 
console.log(`поиск по коррекному id:`, testProductData.getProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log(`поиск по некоррекному id:`, testProductData.getProduct("собака"));
console.log(`выбранный товар, некорректный:`, testProductData.getCurrentProduct());
testProductData.setCurrentProduct(apiProducts.items[0]);
console.log(`выбранный товар, коррекный:`, testProductData.getCurrentProduct());

console.log("КОРЗИНА");
console.log(`все товары в корзине(пусто):`, [...testCartData.getCartProducts()]);
testCartData.addProduct(apiProducts.items[0]);
testCartData.addProduct(apiProducts.items[3]);
console.log(`все товары в корзине:`, [...testCartData.getCartProducts()]);
console.log(`общая цена:`, testCartData.getTotalPrice());
console.log(`общее колчество:`, testCartData.getTotalNumber());
console.log(`есть ли  товар в корзне?:`, testCartData.checkCartProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
testCartData.removeProduct(apiProducts.items[0]);
console.log(`все товары в корзине:`, testCartData.getCartProducts());
console.log(`общая цена:`, testCartData.getTotalPrice());
console.log(`общее колчество:`, testCartData.getTotalNumber());
console.log(`есть ли  товар в корзне?:`, testCartData.checkCartProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
testCartData.clearCart();
console.log(`все товары в корзине:`, testCartData.getCartProducts());
console.log(`общая цена:`, testCartData.getTotalPrice());
console.log(`общее колчество:`, testCartData.getTotalNumber());

console.log("ЗАКАЗ");
console.log(`данные покупателя:`, testOrderData.getFields());
testOrderData.setField("address", "Москва, ул, д...");
testOrderData.setField("payment", "cash");
console.log(`данные покупателя:`, testOrderData.getFields());
console.log(`незаполненные поля:`, testOrderData.getInvalidFields());
testOrderData.setField("email", "...@gmail.com");
testOrderData.setField("phone", "777");
console.log(`незаполненные поля(все поля заполнены):`, testOrderData.getInvalidFields());
testOrderData.clearFields();
console.log(`незаполненные поля:`, testOrderData.getInvalidFields());

console.log("СЕРВЕР");
const testApi = new Api(API_URL);
console.log(`Api:`, testApi);
const testLarekApi = new LarekApi(testApi);
testLarekApi.getProductList()
.then((res) => {
  testProductData.setProducts(res.items)
  console.log(`список товаров с сервера: `, testProductData.getProducts());
})
.catch((err) =>  {
  console.log("ошибка сервера:", err)
})


