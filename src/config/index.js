export default {
  // API KEY
  apiKey: '1f1dd742625fd53980d592437aa7b4ca', //'8Wcw13VSwM7E03x59X4w2V667Lp67R8Q', //62f5a9c133da276c516cc7f491f8a644
  // API URL
  baseUrl: 'http://stg.bingekart.com/api/4.0/', //'https://mobile.mve.demo.cs-cart.com/api/4.0/',http://bingekart.com/cscart/api/4.0/
  // SITE URL
  siteUrl: 'http://stg.bingekart.com/',
  // SHOP NAME
  shopName: 'Bingekart',
  // VERSION MVE OR ULT
  version: 'MVE',
  // Enable push notifications
  pushNotifications: true,
  pushNotificationChannelId: 'cscart.default',
  pushNotificationsColor: '#26323e',
  // Demo app features
  demo: true,
  demoUsername: '',
  demoPassword: '',

  // Apple pay payments
  applePay: false,
  applePayMerchantIdentifier: 'merchant.com.cscart',
  applePayMerchantName: 'CSCartmultivendor',
  applePaySupportedNetworks: ['visa'],

  // Google pay payments
  googlePay: true,
  googlePayApiKey: 'api-key',
  googlePaySupportedNetworks: ['visa'],
};
