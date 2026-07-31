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
import { API_URL, CDN_URL } from './utils/constants';


const events = new EventEmitter
const productData = new ProductData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
larekApi.getProductList()
.then((res) => {
  const updatedProducts = res.items.map(item => {
      return {
        ...item,
        image: CDN_URL + item.image
      };
    });
  productData.setProducts(updatedProducts);
})
.catch((err) =>  {
  console.log("ошибка сервера:", err);
})

const header = new Header(ensureElement<HTMLElement>('.header'), events)
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

events.on('catalog:changed', () => {
  const itemCards = productData.getProducts().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render(item)
  });

  gallery.render({catalog: itemCards})
})

events.on('card:select', (item: IProduct) => {
  productData.setCurrentProduct(item);
});

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit('preview:basket')
});

events.on('preview:basket', () => {
  const currentItem = productData.getCurrentProduct();
  
  if (!currentItem) return;

  const isAlreadyInBasket = basketData.checkBasketProduct(currentItem.id);

  if (isAlreadyInBasket) {
    basketData.removeProduct(currentItem);
  } else {
    basketData.addProduct(currentItem);
  }

  modal.close();
});

events.on('card:preview', (item: IProduct) => {
  const isPriceNull = item.price === null;
  const startTemplateText = basketData.checkBasketProduct(item.id) ? 'Удалить из корзины' : 'В корзину';

  const renderedPreview = cardPreviewView.render({
    ...item,
    disabled: isPriceNull,
    buttonText: startTemplateText,
  } as ICardPreview);

  modal.content = renderedPreview;
  modal.open();
});

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new Basket(cloneTemplate(basketTemplate), events);

events.on('basket:changed', () => {
  header.counter = basketData.getTotalNumber();

  const basketItems = basketData.getBasketProducts().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('basket:remove', item)
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

  basketView.disabled = basketData.getTotalNumber() === 0;
});

events.on('basket:open', () => { 
  basketView.disabled = basketData.getTotalNumber() === 0; 
  modal.content = basketView.render(); 
  modal.open(); 
}); 

events.on('basket:remove', (item: IProduct) => {
  
  basketData.removeProduct(item);
});

const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const orderFormView = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsFormTemplate), events);


events.on('order:submit', () => {
  modal.content = contactsFormView.render();
})

events.on('buyer:changed', () => {
  
  const fields = orderData.getFields();

  const errors = orderData.getInvalidFields();
  const hasOrderErrors = errors.address || errors.payment;
  const orderErrorMessages = [errors.payment, errors.address].filter(Boolean).join(' и ');

  orderFormView.payment = fields.payment; 
  
  orderFormView.render({
    address: fields.address, 
    valid: !hasOrderErrors,
    errors: orderErrorMessages
  });

  const hasContactsErrors = errors.email || errors.phone;
  const contactsErrorMessages = [errors.email, errors.phone].filter(Boolean).join(' и ');

  contactsFormView.render({
    email: fields.email, 
    phone: fields.phone,
    valid: !hasContactsErrors,
    errors: contactsErrorMessages
  });
});

events.on('order.payment:change', (item: { value: TPayment }) => {
  orderData.setField('payment', item.value);
});

events.on('order.address:change', (data: { value: string }) => {
  orderData.setField('address', data.value);
});

events.on('contacts.email:change', (data: { value: string }) => {
  orderData.setField('email', data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
  orderData.setField('phone', data.value);
});

events.on('order:start', () => {
  
  const fields = orderData.getFields();
  const errors = orderData.getInvalidFields();

  const hasOrderErrors = errors.address || errors.payment;
  const orderErrorMessages = [errors.payment, errors.address].filter(Boolean).join(' и ');

  orderFormView.payment = fields.payment;

  modal.content = orderFormView.render({
    address: fields.address,
    valid: !hasOrderErrors,
    errors: orderErrorMessages
  });

  modal.open();
});

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

      orderFormView.render({
        address: '',
        payment: null,
        valid: false,
        errors: ''
      });
      
      orderFormView.payment = null;

      contactsFormView.render({
        email: '',
        phone: '',
        valid: false,
        errors: ''
      });
    })
    .catch((err) => {
      console.error('Критическая ошибка оформления заказа на сервере:', err);
    });
});

events.on('order:success', () => {
  modal.close();
});