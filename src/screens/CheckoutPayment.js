import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView, Button, Image
} from 'react-native';

import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk';
import styles1 from '../constants/App.style';
import { startPayment } from '../constants/WEBCHECKOUT';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk'

// Import actions.
import * as ordersActions from '../actions/ordersActions';
import * as cartActions from '../actions/cartActions';
import * as paymentsActions from '../actions/paymentsActions';

// Components
import StepByStepSwitcher from '../components/StepByStepSwitcher';
import CartFooter from '../components/CartFooter';
import FormBlock from '../components/FormBlock';
import PaymentPhoneForm from '../components/PaymentPhoneForm';
import PaymentCreditCardForm from '../components/PaymentCreditCardForm';
import PaymentEmpty from '../components/PaymentEmpty';
import PaymentCheckForm from '../components/PaymentCheckForm';
import PaymentPaypalForm from '../components/PaymentPaypalForm';
import PaymentYandexKassaForm from '../components/PaymentYandexKassaForm';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';
import { stripTags, formatPrice } from '../utils';
import i18n from '../utils/i18n';
import * as nav from '../services/navigation';
import { OrderDetail } from './OrderDetail';
import base64 from 'react-native-base64'





const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    paymentItemWrapper: {
        paddingLeft: 14,
        paddingRight: 14,
        marginTop: 10,
    },
    paymentItem: {
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#F1F1F1',
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    paymentItemText: {
        fontSize: '0.9rem',
    },
    paymentItemDesc: {
        fontSize: '0.8rem',
        paddingBottom: 6,
        color: 'gray',
        marginTop: 10,
    },
    uncheckIcon: {
        fontSize: '1rem',
        marginRight: 6,
    },
    checkIcon: {
        fontSize: '1rem',
        marginRight: 6,
    },
    stepsWrapper: {
        padding: 14,
    },
});

const TPL_CREDIT_CARD = 'views/orders/components/payments/cc.tpl';
const TPL_EMPTY = 'views/orders/components/payments/empty.tpl';
const TPL_CHECK = 'views/orders/components/payments/check.tpl';
const TPL_PHONE = 'views/orders/components/payments/phone.tpl';
const SUPPORTED_PAYMENT_TPLS = [
    TPL_CREDIT_CARD,
    TPL_EMPTY,
    TPL_CHECK,
    TPL_PHONE,
];

const SCRIPT_YOOKASSA = 'yandex_checkout.php';
const SCRIPT_YOOKASSA_FOR_MARKETPLACES = 'yandex_checkout_for_marketplaces.php';
const SCRIPT_YOOKASSA_LEGACY = 'yandex_money.php';
const SCRIPT_PAYPAL_EXPRESS = 'paypal_express.php';
const SUPPORTED_PAYMENT_SCRIPTS = [
    SCRIPT_YOOKASSA,
    SCRIPT_YOOKASSA_FOR_MARKETPLACES,
    SCRIPT_YOOKASSA_LEGACY,
    SCRIPT_PAYPAL_EXPRESS,
];

/**
 * Checkout. Payment screen.
 *
 * @reactProps {object} cart - Cart information.
 * @reactProps {object} cartActions - Cart actions.
 * @reactProps {object} paymentsActions - Payments actions.
 * @reactProps {object} ordersActions - Orders actions.
 * @reactProps {string} shipping_id - Shipping id.
 */

const WEB = 'Select Cashfree Payments';
const UPI = 'UPI';
const BASE_RESPONSE_TEXT = '';

var token_result = "";
var GetOrderID = "";
var Getamount = "";

export { token_result, GetOrderID, Getamount }

export class CheckoutPayment extends Component {

 

    static propTypes = {
        cart: PropTypes.shape({
            items: PropTypes.arrayOf(PropTypes.object),
            fetching: PropTypes.bool,
        }),
        paymentsActions: PropTypes.shape({
            settlements: PropTypes.func,
        }),
        ordersActions: PropTypes.shape({
            create: PropTypes.func,
        }),
        shipping_id: PropTypes.string,
        cartActions: PropTypes.shape({}),
        
    };

    

    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
            selectedItem: null,
            items: [],
            responseText: BASE_RESPONSE_TEXT,
            upiAppArray: [],
            
        };
       
    }

   componentWillMount(){
    this.placeOrderAndComplete();

   }

    /**
     * Defines the available payment methods.
     */
    componentDidMount() {
                 
        const { cart } = this.props;
        const items = Object.keys(cart.payments)
            .map((k) => cart.payments[k])
            .filter(
                (p) =>
                    SUPPORTED_PAYMENT_TPLS.includes(p.template) ||
                    SUPPORTED_PAYMENT_SCRIPTS.includes(p.script),
            );
        // FIXME: Default selected payment method.
        const selectedItem = items[0];

        this.setState({
            items,
            selectedItem,
        });
        this._getApps();


         // Get Cashfree Token data

        //  const fetchrequestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-client-id': '199686ff4122cd4dd5197ebe7e686991',
        //         'x-client-secret': '9684389899823ba79fe1c5c719928f9f3bf9dcc0'
        //     },
        //     body: JSON.stringify({
        //         orderId: GetOrderID,
        //         orderAmount: Getamount,
        //         orderCurrency: 'INR'
        //     })
        // };
        // fetch('https://test.cashfree.com/api/v2/cftoken/order', fetchrequestOptions)
        //     .then(response => response.json())
        //     .then((responseJson) => {
                
        //         console.log("Cashfree_response", responseJson)
        //         console.log("Cashfree_OrderID", GetOrderID)
        //         console.log("Cashfree_amount", Getamount)
        //         token_result = responseJson[Object.keys(responseJson)[2]];
                
        //        console.log("The token value is :",token_result)
    
        
    
        //     })
    
        
    }

    /**
     * Place order button.
     */
    handlePlaceOrder(){
        const { selectedItem } = this.state;
        if (!selectedItem) {
            return null;
        }

        if (SUPPORTED_PAYMENT_SCRIPTS.includes(selectedItem.script)) {
            return this.placeSettlements();
        }

        return this.placeOrderAndComplete();
    }

    /**
     * Redirects to CheckoutComplete.
     */
    placeOrderAndComplete(){
        const {
            cart,
            ordersActions,
            cartActions,
            storeCart,
            convertedShippingIds,
        } = this.props;
        this.setState({
            fetching: true,
        });

        const orderInfo = {
            products: {},
            coupon_codes: Object.keys(cart.coupons),
            shipping_id: cart?.isShippingRequired ? convertedShippingIds : 0,
            payment_id: 14,
            user_data: cart.user_data,
         
        };
        Object.keys(cart.products).map((key) => {
            const p = cart.products[key];
            orderInfo.products[p.product_id] = {
                product_id: p.product_id,
                amount: p.amount,
                product_options: p.product_options,
            };
            console.log("Totalamount:",p.amount)
            console.log("Product_ID",p.product_id)
            return orderInfo;
        });
           

        ordersActions
        .create(orderInfo)
        .then(({ data }) => {
            this.setState({
                fetching: false,
            });
            if (!data) {
                return;
            }
            cartActions.clear(cart, storeCart.coupons);
            console.log("datavalue",data)
            console.log("orderid::::", data.order_id)
            GetOrderID = data.order_id
        
        })
        .catch(() => {
            this.setState({
                fetching: false,
            });
        });

       
    
     
    return null;
    }

    /**
     * Redirects to SettlementsCompleteWebView.
     */
    placeSettlements() {
        const { cart, shipping_id, ordersActions, paymentsActions } = this.props;

        const orderInfo = {
            products: {},
            coupon_codes: cart.coupons,
            shipping_id,
            payment_id: this.state.selectedItem.payment_id,
            user_data: cart.user_data,
        };
        Object.keys(cart.products).map((key) => {
            const p = cart.products[key];
            
            orderInfo.products[p.product_id] = {
                product_id: p.product_id,
                amount: p.amount,
                
            };
            console.log("Checkout_amount", p.amount)
            console.log("PPP::",p)
            return orderInfo;
        });

        
        this.setState({
            fetching: true,
        });

       

        ordersActions
            .create(orderInfo)
            .then(({ data }) => {
                this.setState({
                    fetching: false,
                });

                if (!data) {
                    return;
                }

                const settlementData = {
                    order_id: data.order_id,
                    replay: false,
                };
                paymentsActions.settlements(settlementData).then((response) => {
                    nav.pushSettlementsCompleteWebView(this.props.componentId, {
                        title: this.state.selectedItem.payment,
                        orderId: data.order_id,
                        cart,
                        ...response.data.data,
                    });
                });
            })
            .catch(() => {
                this.setState({
                    fetching: false,
                });
            });
        return null;
    }

    /**
     * Renders payment methods.
     *
     * @param {object} item - Payment method information.
     *
     * @return {JSX.Element}
     */
    renderItem = (item) => {
        const { payment } = this.state.selectedItem;
        // FIXME compare by name.
        const isSelected = item.payment === payment;
        return (
            <TouchableOpacity
                style={styles.paymentItem}
                onPress={() => {
                    this.setState(
                        {
                            selectedItem: item,
                        },
                        () => {
                            this.listView.scrollToOffset({ x: 0, y: 0, animated: true });
                        },
                    );
                }}>
                {isSelected ? (
                    <Icon name="radio-button-checked" style={styles.checkIcon} />
                ) : (
                    <Icon name="radio-button-unchecked" style={styles.uncheckIcon} />
                )}
                <Text style={styles.paymentItemText}>{stripTags(item.payment)}</Text>
            </TouchableOpacity>
        );
    };

    /**
     * Renders header.
     *
     * @return {JSX.Element}
     */
    renderHeader = () => {
        const { currentStep } = this.props;
        return (
            <View style={styles.stepsWrapper}>
                <StepByStepSwitcher currentStep={currentStep} />
            </View>
        );
    };

    /**
     * Renders form fields.
     *
     * @return {JSX.Element}
     */
    renderFooter() {
        const { cart } = this.props;
        const { selectedItem } = this.state;
        if (!selectedItem) {
            return null;
        }
        let form = null;
        // FIXME: HARDCODE
        switch (selectedItem.template) {
            case TPL_EMPTY:
                form = (
                    <PaymentEmpty
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                    />
                );
                break;
            case TPL_CREDIT_CARD:
                form = (
                    <PaymentCreditCardForm
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                    />
                );
                break;
            case TPL_CHECK:
                form = (
                    <PaymentCheckForm
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                    />
                );
                break;
            case TPL_PHONE:
                form = (
                    <PaymentPhoneForm
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                        value={{ phone: cart.user_data.b_phone }}
                    />
                );
                break;

            default:
                break;
        }

        switch (selectedItem.script) {
            case SCRIPT_PAYPAL_EXPRESS:
                form = (
                    <PaymentPaypalForm
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                    />
                );
                break;
            case SCRIPT_YOOKASSA:
            case SCRIPT_YOOKASSA_FOR_MARKETPLACES:
            case SCRIPT_YOOKASSA_LEGACY:
                form = (
                    <PaymentYandexKassaForm
                        onInit={(ref) => {
                            this.paymentFormRef = ref;
                        }}
                    />
                );
                break;

            default:
                break;
        }

        return (
            <View style={styles.paymentItemWrapper}>
                <FormBlock title={selectedItem.payment}>
                    {form}
                    <Text style={styles.paymentItemDesc}>
                        {stripTags(selectedItem.instructions)}
                    </Text>
                </FormBlock>
            </View>
        );
    }

    /**
     * Renders spinner.
     *
     * @return {JSX.Element}
     */
    renderSpinner = () => {
        const { fetching } = this.state;
        return <Spinner visible={fetching} mode="modal" />;
    };

    /**
     * Renders component
     *
     * @return {JSX.Element}
     */
    changeResponseText = (message) => {
        this.setState({
            responseText: message,
        });
    };

    changeUPIArray = (array) => {
        this.setState({
            upiAppArray: array,
        });
    };

    getFormattedIcon(appName, icon, id) {
        return (
            <TouchableOpacity
                key={id}
                style={styles.round_icon_buttons}
                onPress={() => this._startCheckout(UPI, id)}>
                <Image style={styles.upi_image} source={{ uri: icon }} />
                <Text style={styles.upi_icons_text}> {appName} </Text>
            </TouchableOpacity>
        );
    }

    setApps(obj) {
        let array = [];
        obj.forEach(function (item) {
            console.log(item.id);
            let iconString = item.icon;
            let icon = RNPgReactNativeSdk.getIconString(iconString);
            let button = this.getFormattedIcon(item.displayName, icon, item.id);
            array.push(button);
        }, this);
        this.changeUPIArray(array);
    }

    _getApps() {
        RNPgReactNativeSdk.getUPIApps()
            .then((result) => {
                let obj = JSON.parse(result);
                this.setApps(obj);
            })
            .catch((error) => {
                this.changeUPIArray([
                    <Text key="no_upi_error" style={styles.upi_app_not_found}>
                        {' '}
                        {error.message}{' '}
                    </Text>,
                ]);
            });
    }

    async _startCheckout(mode, appName) {
        console.log('_startCheckout invoked ' + mode + '  ' + appName);

        let responseHandler = (result) => {
            this.changeResponseText(result);
            console.log("My transaction result",result);
            try {
                let output = '';
                JSON.parse(result, function (key, value) {
                    if (key !== '') {
                        output = output + key + ' : ' + value + '\n';
                    }
                    // Do something with the result
                    const requestOptions = {
                        method: 'PUT',
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic Z3VydUBrN2NvbXB1dGluZy5jb206ZzVpT3hZMXhVaE1LczUxMTEwYTg3NTM5NlZET1ZVcnM='
                         },
                        body: JSON.stringify({
                            
                                status: 'P',
                                notify_user: 1,
                                notify_department: 1,
                                notify_vendor: 1
                               
                         })
                    };
                    fetch('https://stg.bingekart.com/api/orders/'+GetOrderID, requestOptions)
                        .then(response => response.json())
                        .then((notifyresponseJson) => {
                
                            console.log("notify_response",notifyresponseJson)
                        })
                });
                this.changeResponseText(output);
            } catch (error) {
                //
            }
        };

        try {
            this.changeResponseText(BASE_RESPONSE_TEXT);
            startPayment(mode, appName, responseHandler);
        } catch (error) {
            this.changeResponseText(error);
        }
    }

    
       
    

    
   
    
    // fetchData = async () => {
                   
    //     // fetch('https://test.cashfree.com/api/v2/cftoken/order',
    //     //     {
    //     //         method: 'POST',
    //     //         headers: {
    //     //             'Accept': 'application/json',
    //     //             'Content-Type': 'application/json',
    //     //             'x-client-id': '199686ff4122cd4dd5197ebe7e686991',
    //     //             'x-client-secret': '9684389899823ba79fe1c5c719928f9f3bf9dcc0'
    //     //         },
    //     //         body: JSON.stringify({
    //     //             orderId: GetOrderID,
    //     //             orderAmount: Getamount,
    //     //             orderCurrency: 'INR'
    //     //         })
                
    //     //     })
    //     //     .then((response) => { return response.json(); })
    //     //     .then((responseJson) => {

    //     //         console.log("Cashfree_response", responseJson)
    //     //         console.log("Cashfree_OrderID", GetOrderID)
    //     //         console.log("Cashfree_amount", Getamount)
    //     //         token_result = responseJson[Object.keys(responseJson)[2]];
                
    //     //        console.log("The token value is :",token_result)


    //            const fetchrequestOptions = {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'x-client-id': '199686ff4122cd4dd5197ebe7e686991',
    //                 'x-client-secret': '9684389899823ba79fe1c5c719928f9f3bf9dcc0'
    //             },
    //             body: JSON.stringify({
    //                 orderId: GetOrderID,
    //                 orderAmount: Getamount,
    //                 orderCurrency: 'INR'
    //             })
    //         };
    //         fetch('https://test.cashfree.com/api/v2/cftoken/order', fetchrequestOptions)
    //             .then(response => response.json())
    //             .then((responseJson) => {
                    
    //                 console.log("Cashfree_response", responseJson)
    //                 console.log("Cashfree_OrderID", GetOrderID)
    //                 console.log("Cashfree_amount", Getamount)
    //                 token_result = responseJson[Object.keys(responseJson)[2]];
                    
    //                console.log("The token value is :",token_result)

    //                const requestOptions = {
    //                 method: 'PUT',
    //                 headers: { 
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Basic Z3VydUBrN2NvbXB1dGluZy5jb206ZzVpT3hZMXhVaE1LczUxMTEwYTg3NTM5NlZET1ZVcnM='
    //                  },
    //                 body: JSON.stringify({
                        
    //                         status: 'P',
    //                         notify_user: 1,
    //                         notify_department: 1,
    //                         notify_vendor: 1
                           
    //                  })
    //             };
    //             fetch('https://stg.bingekart.com/api/orders/'+GetOrderID, requestOptions)
    //                 .then(response => response.json())
    //                 .then((notifyresponseJson) => {
            
    //                     console.log("notify_response",notifyresponseJson)
    //                 })

    //             })

    //         // }).catch((error) => {
    //         //     // alert('error')
    //         //  })

    //               // PUT request using fetch inside useEffect React hook
    
    //             //         this.setState({
    //             //     data: responseJson.Object.keys(0)
                   
    //             // })
                              

           
    // }


    // render() {

    //     // return <WebView source={{ uri: 'https://api.stripe.com/v1/payment_methods' }} />;
    //     return (
    //         <View style={styles1.container}>
    //             <View style={styles1.button}>
    //                 <Button onPress={() => this._startCheckout(WEB, null)} title={WEB} />
    //             </View>
    //             <View style={styles1.button}>
    //                <Button onPress = {this.fetchData} title = "fetch"/>
    //             </View>
    //             <View style={styles1.upi_icon_containers}>{this.state.upiAppArray}</View>
    //             <Text style={styles1.response_text}> {this.state.responseText} </Text>
    //         </View>
    //     );

    // }

    render() {

         const {cart} = this.props;
        // price.replace(/₹ /g, "");
        //Getamount = String(cart.total_formatted.price).replace(/&nbsp;₹/g, '');
       Getamount = (cart.total_formatted.price.replace(/[^\d\.]/g, ""));
        console.log("Amount_Total",Getamount)
        
        //this.placeOrderAndComplete();
       
        // return <WebView source={{ uri: 'https://api.stripe.com/v1/payment_methods' }} />;
        return (
                     
           
            <SafeAreaView style={styles.container}>
                <KeyboardAwareScrollView>
                    <FlatList
                        ref={(ref) => {
                            this.listView = ref;
                        }}
                        contentContainerStyle={styles.contentContainer}
                        ListHeaderComponent={() => this.renderHeader()}
                        ListFooterComponent={() => this.renderFooter()}
                        data={this.state.items}
                        keyExtractor={(item, index) => `${index}`}
                        numColumns={1}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                    />
                </KeyboardAwareScrollView>
                <CartFooter
                totalPrice={formatPrice(cart.total_formatted.price)}
          btnText={i18n.t('Select Cashfree').toUpperCase()}
          isBtnDisabled={false}
          onBtnPress={() => this._startCheckout(WEB, null)}
                                    
                />
                
                {this.renderSpinner()}
               
                
            </SafeAreaView>
        );

    }
}

export default connect(
    (state) => ({
        auth: state.auth,
        storeCart: state.cart,
    }),
    (dispatch) => ({
        ordersActions: bindActionCreators(ordersActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
        paymentsActions: bindActionCreators(paymentsActions, dispatch),
    }),
)(CheckoutPayment);
