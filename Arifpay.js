require('dotenv').config()
import { v4 as uuidv4 } from 'uuid';
const BASE_URL=process.env.Base_url || "http://196.189.44.37:2000/api/sandbox";
const MakePayment_url=process.env.Create_checkout_path || "/checkout/session";
export class ArifPay{
    constructor(API_key,expireDate){
        this.API_key=API_key;
        this.expireDate=expireDate;
    }
    Make_payment(payment_info)
    {
        let errors=[];
        if(!payment_info.paymentMethods[0]) errors.push("Payment method is required");
        if(!payment_info.items[0]) errors.push("At least one item is needed");
        if(!payment_info.beneficiaries[0]) errors.push("At least one Payment Recipient/Beneficiary is needed");
        if (errors.length) throw new Error(errors.join(', '));
        Object.keys(payment_info.customization || {}).forEach((field) => {
            payment_info[`customization[${field}]`] =
              payment_info.customization[field];
          });
          delete payment_info.customization;
          payment_info.nonce=uuidv4();
          payment_info.expireDate=this.expireDate;
          return new Promise((resolve, reject) => {
            fetch(BASE_URL + MakePayment_url, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'x-arifpay-key': this.API_key,
              },
              body: JSON.stringify({
                ...payment_info
              }),
            })
              .then(async (response) => {
                let apiResponse = await response.json();
                apiResponse = apiResponse.data;
                if (response.status != 200) return apiResponse;
                resolve(apiResponse);
              })
              .catch((e) => reject(e));
          });
    }
}
