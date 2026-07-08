import { TPayment, IBuyer } from "../../types";

export type TOrderValidationResult = {
      payment?: string;  
      address?: string;
      email?: string;
      phone?: string;
    }

 export class OrderData {
  protected _payment: TPayment;
  protected _email: string;
  protected _phone: string;
  protected _address: string;

  constructor(){
    this._payment = "";
    this._email = "";
    this._phone ="";
    this._address ="";
  }
  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case "payment":
        this._payment = value as TPayment;
        break;
      case "email":
        this._email = value  as string;
        break;
      case "phone":
        this._phone = value as string;
        break;
      case "address":
        this._address  = value as string;
        break;
    }
  }
  getFields(): IBuyer {
    return {
    payment: this._payment,
    email: this._email,
    phone: this._phone,
    address: this._address
    }
  }
  clearFields(): void {
    this._payment = "";
    this._email = "";
    this._phone ="";
    this._address ="";
  }
  
  getInvalidFields(): TOrderValidationResult {
    let obj: TOrderValidationResult = {}
      if(this._payment === "") {obj.payment = "Не выбран вид оплаты"}
      if(this._email === "") {obj.email = "Укажите емэйл"}
      if(this._phone === "") {obj.phone = "Укажите контактный номер"}
      if(this._address === "") {obj.address = "Укажите адрес доставки"}
    return obj;
  }
}