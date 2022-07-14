'use strict'
import React, { Component } from 'react'
import {
    StyleSheet, TouchableOpacity, View, Image
} from 'react-native'

import Text from './form/Text'
import Icon from 'react-native-vector-icons/FontAwesome'
import colors from './../resources/styles/colors'
import * as nav from '../services/navigation';
import BannerBlock from '../components/BannerBlock';
import VendorBlock from '../components/VendorBlock';
import PageBlock from '../components/PageBlock';
import ProductBlock from '../components/ProductBlock';
import CategoryBlock from '../components/CategoryBlock';
import PushNotificaitons from '../components/PushNotifications';
import { toArray } from '../utils';
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import config from '../config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as notificationsActions from '../actions/notificationsActions';
import * as layoutsActions from '../actions/layoutsActions';


let SideMenuWidth = 300
class Menu extends Component {
 //  { this._renderHeader() }

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.isFetchBlocksSend = false;
        this.pushNotificationListener = null;
        this.pushNotificationOpenListener = null;
        this.backToHomeScreenHandler = null;

        this.state = {
            refreshing: false,
        };
    }


  /**
   * Sets titles. Gets layouts. Registers 2 event listeners for notifications.
   * 1. Shows notifications if they came.
   * 2. Listens to click on notification.
   */
  async componentDidMount() {
    const { layoutsActions, componentId } = this.props;
    // Listener for home button. Returns to home screen.
    this.backToHomeScreenHandler =
        Navigation.events().registerBottomTabSelectedListener(
            ({ selectedTabIndex, unselectedTabIndex }) => {
                if (selectedTabIndex === 0 && unselectedTabIndex === 0) {
                    Navigation.popToRoot(componentId);
                }
            },
        );
    Navigation.mergeOptions(this.props.componentId, {
        topBar: {
            title: {
                // text: config.shopName.toUpperCase(),
                fontWeight: 'bold',
                fontSize: '1.3rem',

            },
            leftButtons: [
                {
                    icon: require("./../assets/logo_bingekart.png")

                },
            ],





            //rightButtons: [
            //   {
            //      id: 'clearWishList',
            //      icon: iconsMap.person,
            //  },
            //],
        },
    });

    layoutsActions.fetch();

    if (config.pushNotifications) {
        const permissionGranted = await PushNotificaitons.Init(componentId);
        if (permissionGranted) {
            this.pushNotificationListener = PushNotificaitons.RegisterPushListener(
                componentId,
            );
        }
    }
}


/**
 * Removes event listeners for notifications.
 */
componentWillUnmount() {
    if (config.pushNotifications && this.pushNotificationListener) {
        this.pushNotificationListener();
    }
    this.backToHomeScreenHandler.remove();
}



    renderBlock = (block, index) => {
        if (!get(block, 'content.items')) {
            return null;
        }

        const items = toArray(block.content.items);
        switch (block.type) {
            case BLOCK_BANNERS:
                return (
                    <BannerBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(banner) => {
                            registerDrawerDeepLinks(
                                {
                                    link: banner.url,
                                    payload: {
                                        ...banner,
                                        title: banner.banner,
                                    },
                                },
                                this.props.componentId,
                            );
                        }}
                        key={index}
                    />
                );

            case BLOCK_PRODUCTS:
                return (
                    <ProductBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(product) => {
                            nav.pushProductDetail(this.props.componentId, {
                                pid: product.product_id,
                            });
                        }}
                        key={index}
                    />
                );

            case BLOCK_CATEGORIES:
                return (
                    <CategoryBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(category) => {
                            nav.pushCategory(this.props.componentId, { category });
                        }}
                        key={index}
                    />
                );

            case BLOCK_PAGES:
                return (
                    <PageBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(page) => {
                            nav.showPage(this.props.componentId, {
                                uri: `${config.siteUrl}index.php?dispatch=pages.view&page_id=${page.page_id}`,
                                title: page.page,
                            });
                        }}
                        key={index}
                    />
                );

            case BLOCK_VENDORS:
                return (
                    <VendorBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(vendor) => {
                            nav.showModalVendor({
                                companyId: vendor.company_id,
                                company: vendor.company,
                            });
                        }}
                        key={index}
                    />
                );

            default:
                return null;
        }
    };

    render() {
        return (
            <View style={[styles.sideMenu, this.props.style || {}]}>

                  <View style={{ paddingHorizontal: 30 }}>
                     
                    <TouchableOpacity style={[styles.menu, { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 }]}
                        onPress={(category) => { nav.pushCategory(this.props.componentId, { category });}} >
                            <Icon name='home' color={colors.txtWhite} size={24} />
                            <Text style={styles.menuText} type='h5White'>Computers</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={ styles.menu }>
                            <Icon name='cog' color={colors.txtWhite} size={24} />
                            <Text style={styles.menuText} type='h5White'>Tablets & Accessories</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={ styles.menu }>
                            <Icon name='cog' color={colors.txtWhite} size={24} />
                            <Text style={styles.menuText} type='h5White'>Desktop</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={ styles.menu }>
                            <Icon name='comment-o' color={colors.txtWhite} size={24} />
                            <Text style={styles.menuText} type='h5White'>Laptops</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={ styles.menu }>
                            <Icon name='bell-o' color={colors.txtWhite} size={24} />
                            <Text style={styles.menuText} type='h5White'>Printers</Text>
                      </TouchableOpacity>
                  </View>
            </View>
        )
    }

    _renderHeader() {
        return (
            <View style={ styles.header }>
                <View style={ styles.userInfosHolder }>
                    <Image style={ styles.avatar } source={{ uri: 'https://scontent-frt3-1.cdninstagram.com/t51.2885-15/s640x640/e15/15623603_1636005733360687_308770619158167552_n.jpg' }} />
                    <View style={ styles.userInfos }>
                        <Text type='h1White' style={styles.username}>Username</Text>
                        <Text type='h5White'>View and edit profile</Text>
                    
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sideMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: SideMenuWidth,
        backgroundColor: 'transparent'
    },
    sideMenuTitle: {
        marginLeft: 20,
        marginBottom: 30
    },
    menu: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    menuText: {
        marginLeft: 20
    },
    header: {
        marginTop: 20,
        marginBottom: 20
    },
    userInfosHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    userInfos: {
        height: 50,
        justifyContent: 'center'
    },
    username: {
        fontWeight: '700'
    }
})

module.exports = Menu


export default connect(
    (state) => ({
        notifications: state.notifications,
        layouts: state.layouts,
    }),
    (dispatch) => ({
        layoutsActions: bindActionCreators(layoutsActions, dispatch),
        notificationsActions: bindActionCreators(notificationsActions, dispatch),
    }),
)(Menu);
