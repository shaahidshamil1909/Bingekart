import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl, TouchableHighlight, Image, TouchableOpacity, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import get from 'lodash/get';
import { AppRegistry } from 'react-native'
import styles from './styles';
import drawerStyles from './drawerStyles';
import Drawer from 'react-native-drawer';
import PushyHorizontalMenu from '../screens/drawers/PushyHorizontalMenu'
import * as pagesActions from '../actions/pagesActions';
import Icon from '../components/Icon';
import * as authActions from '../actions/authActions';
import * as settingsActions from '../actions/settingsActions';
import { setStartSettings } from '../actions/appActions';
import theme from '../config/theme';

// Constants
import {
  BLOCK_BANNERS,
  BLOCK_CATEGORIES,
  BLOCK_PRODUCTS,
  BLOCK_PAGES,
  BLOCK_VENDORS,
} from '../constants';

// Import actions.
import * as notificationsActions from '../actions/notificationsActions';
import * as layoutsActions from '../actions/layoutsActions';

// Components
import Spinner from '../components/Spinner';
import BannerBlock from '../components/BannerBlock';
import VendorBlock from '../components/VendorBlock';
import PageBlock from '../components/PageBlock';
import ProductBlock from '../components/ProductBlock';
import CategoryBlock from '../components/CategoryBlock';
import CategorySideMenuBlock from '../components/CategorySideMenuBlock';
import PushNotificaitons from '../components/PushNotifications';
import { toArray } from '../utils';
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import config from '../config';
import * as nav from '../services/navigation';
import { iconsMap } from '../utils/navIcons';
import i18n from '../utils/i18n';

// Styles
const style = EStyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        resizeMode: 'contain',
        width: '100%',
        height: 110,

    },
    signInSectionContainer: {
        backgroundColor: '#16264C',
        width: '100%',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signInSectionText: {
        color: '#9c9c9c',
        fontWeight: 'bold',
        fontSize: '0.8rem',
    },
    signInBtnContainer: {
        backgroundColor: '#16264C',
        width: '100%',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '$menuItemsBorderColor',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signInButtons: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    signInBtnText: {
        color: '#FFF',
    },
    btn: {
        borderRadius: '$borderRadius',
        height: 38,
        marginBottom: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '$menuTextColor',
        fontSize: '1rem',
    },
    signInInfo: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 30,
    },
    signOut: {
        paddingBottom: 30,
    },
    userNameText: {
        color: '$menuTextColor',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    userMailText: {
        color: '$menuTextColor',
        fontSize: '1rem',
    },
    IconNameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemIcon: {
        fontSize: '1.2rem',
        color: '$menuIconsColor',
        marginRight: 5,
    },
    rightArrowIcon: {
        fontSize: '1rem',
        color: '$menuIconsColor',
    },
    hintText: {
        fontSize: '0.8rem',
        color: '$menuIconsColor',
    },
});

const categorystyles = EStyleSheet.create({
    container: {
        backgroundColor: '$categoriesBackgroundColor',
        padding: 5,
        paddingTop: 5,
        paddingBottom: 10,
    },
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
        alignItems: 'stretch',
    },
    header: {
        fontWeight: 'bold',
        fontSize: '1.3rem',
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#efff',
        textAlign: 'left',

    },
});


/**
 * Renders main screen.
 *
 * @reactProps {object} layoutsActions - Layouts actions.
 * @reactProps {object} notifications - Notifications information.
 * @reactProps {object} notificationsActions - Notifications actions.
 * @reactProps {object} navigator - Navigator.
 * @reactProps {object} layouts - Information about blocks for rendering.
 * 
 * 
 */



export class Layouts extends Component {


  /**
   * @ignore
   */
  static propTypes = {
    layoutsActions: PropTypes.shape({
      fetch: PropTypes.func,
    }),
    notifications: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
    }),
    notificationsActions: PropTypes.shape({
      hide: PropTypes.func,
    }),
      layouts: PropTypes.shape({}),
      authActions: PropTypes.shape({
          registration: PropTypes.func,
      }),

  };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.isFetchBlocksSend = false;
    this.pushNotificationListener = null;
    this.pushNotificationOpenListener = null;
    this.backToHomeScreenHandler = null;
      this.state = { drawerOpen: null };
    this.state = {
      refreshing: false,
    };
      Navigation.events().registerNavigationButtonPressedListener(
          ({ buttonId }) => {
              this.topNavigationButtonPressed(buttonId);
          },
      );

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
                 text: config.shopName.toUpperCase(),
                fontWeight: 'bold',
                fontSize: '1.3rem',

            },
            leftButtons: [
                {
                    id: 'sidemenu',
                    icon: iconsMap.menu,
                   // icon: require("./../assets/logo_bingekart.png")

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




    topNavigationButtonPressed(buttonId) {
        if (buttonId === 'sidemenu') {
            
                    this.setState({ drawerOpen: true });
                
       
        }
    }

  /**
   * Shows and hides notifications.
   */
  componentWillReceiveProps(nextProps) {
    const { notificationsActions } = this.props;

    if (nextProps.notifications.items.length) {
      const notify =
        nextProps.notifications.items[nextProps.notifications.items.length - 1];
      Navigation.showOverlay({
        component: {
          name: 'Notification',
          passProps: {
            title: notify.title,
            type: notify.type,
            text: notify.text,
          },
          options: {
            layout: {
              componentBackgroundColor: 'transparent',
            },
            overlay: {
              interceptTouchOutside: false,
            },
          },
        },
      });
      notificationsActions.hide(notify.id);
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

  /**
   * Renders layout.
   *
   * @param {object} block - Layout information.
   * @param {number} index - Layout index.
   *
   * @return {JSX.Element}
   */
   



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

  onRefresh() {
    const { layoutsActions } = this.props;
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
      layoutsActions.fetch(undefined, true);
    }, 1000);
  }

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */

    rendercategoryBlock = (block, index) => {
        if (!get(block, 'content.items')) {
            return null;
        }

        const items = toArray(block.content.items);
        switch (block.type) {
            case BLOCK_CATEGORIES:
                return (
                    <CategorySideMenuBlock
                        name={block.name}
                        wrapper={block.wrapper}
                        items={items}
                        onPress={(category) => {
                            nav.pushCategory(this.props.componentId, { category });
                        }}
                        key={index}
                    />
                );

            default:
                return null;
        }
    };


    renderPages = (pages) => {
        return (
            <View>
                <View style={style.signInSectionContainer}>
                    <Text style={style.signInSectionText}>
                        {i18n.t('Pages').toUpperCase()}
                    </Text>
                </View>
                {pages.items.map((page, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={style.signInBtnContainer}
                            onPress={() =>
                                registerDrawerDeepLinks(
                                    {
                                        link: `dispatch=pages.view&page_id=${page.page_id}`,
                                        payload: {
                                            title: page.page,
                                        },
                                    },
                                    this.props.componentId,
                                )
                            }>
                            <Text style={style.signInBtnText}>{page.page}</Text>
                            <Icon name="chevron-right" style={style.rightArrowIcon} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };


    logoutHandler = async () => {
        const { authActions, auth } = this.props;
        await authActions.unsubscribeNotifications(auth.pushNotificationId);
        await authActions.logout();
        CookieManager.clearAll(true);
    };

    renderSettings(settings) {
    }

    renderUserInformation = (cart) => {
        if (
            cart.user_data.b_firstname ||
            cart.user_data.b_lastname ||
            cart.user_data.email
        ) {
            return (
                <>
                    {(cart.user_data.b_firstname ||
                        cart.user_data.b_lastname ||
                        cart.user_data.email) && (
                            <View style={styles.signInInfo}>
                                <Text style={styles.userNameText} numberOfLines={2}>
                                    {cart.user_data.b_firstname} {cart.user_data.b_lastname}
                                </Text>
                                <Text style={styles.userMailText}>{cart.user_data.email}</Text>
                            </View>
                        )}
                </>
            );
        }
        return null;
    };

    renderSignedIn = (auth, cart) => {
        return (
            <>
                <View>
                    {theme.$logoUrl !== '' && (
                        <Image source={{ uri: theme.$logoUrl }} style={styles.logo} />
                    )}
                </View>
                {!auth.logged ? (
                    <View style={styles.signInButtons}>
                        <TouchableOpacity
                            onPress={() => nav.showLogin()}
                            style={{ ...styles.btn, backgroundColor: '#ea5920' }}>
                            <Text style={{ ...styles.btnText, color: '#fff' }}>
                                {i18n.t('Sign in')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => nav.pushRegistration(this.props.componentId)}
                            style={styles.btn}>
                            <Text style={styles.btnText}>{i18n.t('Registration')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    this.renderUserInformation(cart)
                )}
            </>
        );
    };


    renderSignedInMenu = () => {
        return (
            <>
                <View style={style.signInSectionContainer}>
                    <Text style={style.signInSectionText}>
                        {i18n.t('My Account').toUpperCase()}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => nav.pushProfileEdit(this.props.componentId)}
                    style={style.signInBtnContainer}>
                    <View style={style.IconNameWrapper}>
                        <Icon name="person" style={style.menuItemIcon} />
                        <Text style={style.signInBtnText}>{i18n.t('Profile')}</Text>
                    </View>
                    <Icon name="chevron-right" style={styles.rightArrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => nav.pushOrders(this.props.componentId)}
                    style={style.signInBtnContainer}>
                    <View style={style.IconNameWrapper}>
                        <Icon name="receipt" style={style.menuItemIcon} />
                        <Text style={style.signInBtnText}>{i18n.t('Orders')}</Text>
                    </View>
                    <Icon name="chevron-right" style={style.rightArrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={this.logoutHandler}
                    style={style.signInBtnContainer}>
                    <View style={style.IconNameWrapper}>
                        <Icon name="exit-to-app" style={style.menuItemIcon} />
                        <Text style={style.signInBtnText}>{i18n.t('Logout')}</Text>
                    </View>
                    <Icon name="chevron-right" style={style.rightArrowIcon} />
                </TouchableOpacity>
            </>
        );
    };


    renderSideMenuContent = () => {
        const { layouts } = this.props;
        const renderblocksList = layouts.blocks.map((block, index) =>
            this.rendercategoryBlock(block, index),
        );

        if (layouts.fetching) {
            return <Spinner visible />;
        }
        const { profile, pages, auth, cart, settings } = this.props;
        return (
         /*   <ScrollView style={style.container}>

                {settings.languageCurrencyFeatureFlag && this.renderSettings(settings)}

                {auth.logged && this.renderSignedInMenu()}

                {this.renderPages(pages)}
            </ScrollView>*/
             renderblocksList
        )
    }

    renderMainContent = () => {
        const { layouts } = this.props;
        const blocksList = layouts.blocks.map((block, index) =>
            this.renderBlock(block, index),
        );

        if (layouts.fetching) {
            return <Spinner visible />;
        }

        if (!this.state.drawerOpen) {
            return (
                <ScrollView
                    style={style.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }>
                    {blocksList}
                </ScrollView>
            )
        } else {
            return (
                <Text style={styles.drawerOpen}>
                </Text>
            )
        }
    }

    render() {

       
        //return <PushyHorizontalMenu />

        return (         
            <Drawer
                open={this.state.drawerOpen}
                content={this.renderSideMenuContent()}
                type="overlay"
                tapToClose={true}
                styles={drawerStyles}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                onClose={() => {
                    this.setState({ drawerOpen: false });
                }}
                panOpenMask={0.80}
                captureGestures="open"
                acceptPan={false}>
                <View style={styles.container}>
                    
                        {this.renderMainContent()}
                   
                </View>
            </Drawer>
        );
    }
  
}

export default connect(
  (state) => ({
    notifications: state.notifications,
        layouts: state.layouts,
        auth: state.auth,
        pages: state.pages,
        cart: state.cart,
        profile: state.profile,
        settings: state.settings,

  }),
  (dispatch) => ({
    layoutsActions: bindActionCreators(layoutsActions, dispatch),
      notificationsActions: bindActionCreators(notificationsActions, dispatch),
      authActions: bindActionCreators(authActions, dispatch),
      pagesActions: bindActionCreators(pagesActions, dispatch),
      settingsActions: bindActionCreators(settingsActions, dispatch),
  }),
)(Layouts);
