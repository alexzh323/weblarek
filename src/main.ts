import './scss/styles.scss';
import { BasketData } from './components/Models/BasketData';
import { ProductData } from './components/Models/ProductData';
import { OrderData } from './components/Models/OrderData';
import { Api } from './components/base/Api';
import { LarekApi } from './components/Communication/LarekApi';
import { EventEmitter} from './components/base/Events';
import { CardCatalog } from './components/views/CardCatalog';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardPreview, ICardPreview } from './components/views/CardPreview';
import { IProduct, TPayment } from './types';
import { Header } from './components/views/Header';
import { Basket } from './components/views/Basket';
import { CardBasket } from './components/views/CardBasket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { API_URL } from './utils/constants';

const events = new EventEmitter
const productData = new ProductData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
larekApi.getProductList()
.then((res) => {
  productData.setProducts(res.items);
})
.catch((err) =>  {
  console.log("ошибка сервера:", err);
})

const header = new Header(ensureElement<HTMLElement>('.header'), events)
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

events.on('catalog:changed', () => {
  const ItemCards = productData.getProducts().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:preview', item)
    });
    return card.render(item)
  });

  gallery.render({catalog: ItemCards})
})

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

events.on('card:preview', (item: IProduct) => {
 
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {

      const isAlreadyInBasket = basketData.checkBasketProduct(item.id);

      if(isAlreadyInBasket) {
        basketData.removeProduct(item);
      } else {
        basketData.addProduct(item); 
      }
      modal.close();
    }
  });

  const isPriceNull = item.price === null;
  const startTemplateText = basketData.checkBasketProduct(item.id) ? 'Удалить из корзины' : 'В корзину';

  const renderedPreview = cardPreview.render({
    ...item,
    disabled: isPriceNull,
    buttonText: startTemplateText,
  } as ICardPreview);

  modal.content = renderedPreview;
  modal.open();
});

events.on('basket:changed', () => {
  header.counter = basketData.getTotalNumber();
})

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new Basket(cloneTemplate(basketTemplate), events);

function updateBasketView() {
  const basketItems = basketData.getBasketProducts().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        basketData.removeProduct(item);
      }
    });

    return cardBasket.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });

  basketView.render({
    catalog: basketItems,
    total: basketData.getTotalPrice()
  });
}

events.on('basket:changed', () => {
  header.counter = basketData.getTotalNumber();

  updateBasketView();
  basketView.disabled = basketData.getTotalNumber() === 0;
});

events.on('basket:open', () => {
  basketView.disabled = basketData.getTotalNumber() === 0;
  modal.content = basketView.render();
  modal.open();
});

const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const orderFormView = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsFormTemplate), events);

events.on('order:start', () => {
  orderData.clearFields();
  
  modal.content = orderFormView.render({
    address: '',
    payment: null,
    valid: false,
    errors: ''
  });

  contactsFormView.render({
    email: '',
    phone: '',
    valid: false,
    errors: ''
  });

  modal.content = orderFormView.render();
  modal.open();
})

events.on('order:submit', () => {
  modal.content = contactsFormView.render();
})

events.on('order.payment:change', (item: {value: TPayment} ) => {
  const payment = item.value;
  orderData.setField('payment', payment);
  orderFormView.payment = payment;
})

events.on('order.address:change', (data: { value: string }) => {
  orderData.setField('address', data.value);
});

events.on('contacts.email:change', (data: { value: string }) => {
  orderData.setField('email', data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
  orderData.setField('phone', data.value);
});

events.on('order:validate', (errors: any) => {
  const hasOrderErrors = errors.address || errors.payment;
  
  const orderErrorMessages = [errors.payment, errors.address]
    .filter(Boolean)
    .join(' и ');

  orderFormView.render({
    valid: !hasOrderErrors,
    errors: orderErrorMessages
  });

  const hasContactsErrors = errors.email || errors.phone;
  
  const contactsErrorMessages = [errors.email, errors.phone].filter(Boolean).join(' и ');

  contactsFormView.render({
    valid: !hasContactsErrors, 
    errors: contactsErrorMessages
  });
})

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successView = new Success(cloneTemplate(successTemplate), events);

events.on('contacts:submit', () => {
  const orderPayload = {
    ...orderData.getFields(),
    total: basketData.getTotalPrice(),
    items: basketData.getBasketProducts().map(item => item.id)
  }

  larekApi.orderProducts(orderPayload)
    .then((res) => {
      
      const renderedSuccess = successView.render({
        total: res.total
      });

      modal.content = renderedSuccess;

      basketData.clearBasket();

      orderData.clearFields();
    })
    .catch((err) => {
      console.error('Критическая ошибка оформления заказа на сервере:', err);
    });
});

events.on('order:success', () => {
  modal.close();
});
