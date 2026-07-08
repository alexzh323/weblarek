import { TPayment, IBuyer, IOrderValidationResult } from "../../types";

 export class OrderData {
  protected payment: TPayment | null;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor(){
    this.payment = null;
    this.email = "";
    this.phone ="";
    this.address ="";
  }

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case "payment":
        this.payment = value as TPayment | null;
        break;
      case "email":
        this.email = value  as string;
        break;
      case "phone":
        this.phone = value as string;
        break;
      case "address":
        this.address  = value as string;
        break;
    }
  }

  getFields(): IBuyer {
    return {
    payment: this.payment,
    email: this.email,
    phone: this.phone,
    address: this.address
    }
  }

  clearFields(): void {
    this.payment = null;
    this.email = "";
    this.phone ="";
    this.address ="";
  }
  
  getInvalidFields(): IOrderValidationResult {
    const obj: IOrderValidationResult = {}
      if(this.payment === null) {obj.payment = "Не выбран вид оплаты";}
      if(!this.email.trim()) {obj.email = "Укажите емэйл";}
      if(!this.phone.trim()) {obj.phone = "Укажите контактный номер";}
      if(!this.address.trim()) {obj.address = "Укажите адрес доставки";}
    return obj;
  }
}