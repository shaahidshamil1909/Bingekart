import RNPgReactNativeSdk from "react-native-pg-react-native-sdk/bridge";
import * as ordersActions from '../actions/ordersActions';
import * as cartActions from '../actions/cartActions';
import * as paymentsActions from '../actions/paymentsActions';
import { Component } from "react";
import * as CheckoutPayment from "../screens/CheckoutPayment";

import { token_result, GetOrderID, Getamount } from "../screens/CheckoutPayment";

const UPI = "UPI";

export function  startPayment(mode: string, appName: string, responseHandler) {


  var token_result = "";
  var getorderid = GetOrderID;
  var getamount = Getamount;
  // var gettoken = token_result;
 
 const fetchrequestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-client-id': '199686ff4122cd4dd5197ebe7e686991',
      'x-client-secret': '9684389899823ba79fe1c5c719928f9f3bf9dcc0'
  },
  body: JSON.stringify({
      orderId: GetOrderID,
      orderAmount: Getamount,
      orderCurrency: 'INR'
  })
};
fetch('https://test.cashfree.com/api/v2/cftoken/order', fetchrequestOptions)
  .then(response => response.json())
  .then((responseJson) => {
      
      console.log("Cashfree_response", responseJson)
      console.log("Cashfree_OrderID", GetOrderID)
      console.log("Cashfree_amount", Getamount)
      token_result = responseJson[Object.keys(responseJson)[2]];
      
     console.log("The token value is :",token_result)

     let env = "TEST"; // "TEST" or "PROD"
  const checkout = new Map<string, string>();
  //checkout.set("orderId",)
  checkout.set("orderId", ""+getorderid+""); // orderId here
  checkout.set("orderAmount", ""+getamount+""); // orderAmount here
    checkout.set("appId", "199686ff4122cd4dd5197ebe7e686991"); // apiKey here
    checkout.set("tokenData",""+token_result+""); // cfToken here

  checkout.set("orderCurrency", "INR");
  checkout.set("orderNote", "Test Note");
  checkout.set("customerName", "Cashfree User");
  checkout.set("customerPhone", "9999999999");
  checkout.set("customerEmail", "cashfree@cashfree.com");
  checkout.set("hideOrderId", "true");
  checkout.set("color1", "#6002EE");
  checkout.set("color2", "#ffff1f");

  console.log("GetOrderid_web",getorderid)
  console.log("Getamonut_web",getamount)
  console.log("Gettoken",token_result)

  if (mode === UPI) {
    if (appName != null) {
      checkout.set("Bingekart", appName);
    }
    RNPgReactNativeSdk.startPaymentUPI(checkout, env, responseHandler);
  } else {
    RNPgReactNativeSdk.startPaymentWEB(checkout, env, responseHandler);
  }
     
  })
  
}
