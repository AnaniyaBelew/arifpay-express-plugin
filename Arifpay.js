require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const BASE_URL=process.env.Base_url || "http://196.189.44.37:2000/api/sandbox";
const MakePayment_url=process.env.Create_checkout_path || "/checkout/session";
class ArifPay{
    constructor(API_key,expireDate){
        this.API_key=API_key;
        this.expireDate=expireDate;
    }
    change_to_number(data)
    {
      data.items.forEach(item=>{
        item.quantity=Number(item.quantity);
        item.price=Number(item.price);
      })
      data.beneficiaries.forEach(benef=>{
        benef.amount=Number(benef.amount);
      })
      return data;
    }
    async Make_payment(payment_info)
    {
      const requiredFields = [
        "cancelUrl",
        "successUrl",
        "errorUrl",
        "notifyUrl",
        "paymentMethods",
        "items",
        "beneficiaries",
      ];
    
      const missingFields = requiredFields.filter(
        (field) => payment_info[field].length===0
      );
    
      if (missingFields.length > 0) {
        const missingFieldsObj = {};
        missingFields.forEach((field) => {
          missingFieldsObj[field] = `${field} is a required field please enter this field`;
        });
        return missingFieldsObj;
      }
    
      Object.keys(payment_info.customization || {}).forEach((field) => {
        payment_info[`customization[${field}]`] = payment_info.customization[field];
      });
      delete payment_info.customization;
      payment_info.nonce = uuidv4();
      payment_info.expireDate = this.expireDate;
      payment_info=this.change_to_number(payment_info);
      console.log(payment_info);
      if (missingFields.length === 0) {
        const url = BASE_URL+MakePayment_url;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-arifpay-key":this.API_key,
          },
          body: JSON.stringify(payment_info),
        };
        
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
}
}
}
module.exports=ArifPay;
const arifPay = new ArifPay("G8FbER8zZ9uco5tLuVnNKycJwXzvJTyo","2025-02-01T03:45:27");
const paymentInfo = {
    cancelUrl: "https://example.com",
    errorUrl: "http://error.com",
    notifyUrl: "https://gateway.arifpay.net/test/callback",
    successUrl: "http://example.com",
    paymentMethods: [
    ],
    expireDate: "2025-02-01T03:45:27",
    items: [
        {
            "name": "ሙዝ",
            "quantity": 1,
            "price": 1,
            "description": "Fresh Corner preimuim Banana.",
            "image": "https://4.imimg.com/data4/KK/KK/GLADMIN-/product-8789_bananas_golden-500x500.jpg"
        },
        {
            "name": "ሙዝ",
            "quantity": 1,
            "price": 1,
            "description": "Fresh Corner preimuim Banana.",
            "image": "https://4.imimg.com/data4/KK/KK/GLADMIN-/product-8789_bananas_golden-500x500.jpg"
        }
    ],
    beneficiaries: [
        {
            "accountNumber": "01320811436100",
            "bank": "AWINETAA",
            "amount": 2.0
        }
    ],
    lang: "EN"
};

arifPay.Make_payment(paymentInfo).then(res=>console.log(res))