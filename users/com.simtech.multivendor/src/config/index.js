export default {
  // API KEY
    apiKey: '8Wcw13VSwM7E03x59X4w2V667Lp67R8Q', //'8Wcw13VSwM7E03x59X4w2V667Lp67R8Q', //62f5a9c133da276c516cc7f491f8a644
    // API URL
    baseUrl: 'http://bingekart.com/cscart/api/4.0/', //'https://mobile.mve.demo.cs-cart.com/api/4.0/',http://bingekart.com/cscart/api/4.0/
    // SITE URL
    siteUrl: 'http://bingekart.com/cscart/',
  // SHOP NAME
  shopName: 'CS-Cart Mobile',
  // SHOP DEFAULT LAYOUT ID
  layoutId: 2, // Default www.mobile.demo.cs-cart.com layout id
  // VERSION MVE OR ULT
  version: 'MVE',
  // Enable push notifications
  pushNotifications: true,
  pushNotificationChannelId: 'cscart.default',
  pushNotificationsColor: '#26323e',
  // Demo app features
  demo: true,
  demoUsername: 'acmecorp@example.com',
  demoPassword: 'vendor',

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
