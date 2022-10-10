import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Animated,
    Image,
    TextInput
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { PRODUCT_NUM_COLUMNS, PRODUCT_IMAGE_WIDTH } from '../utils';
import i18n from '../utils/i18n';
import { BLOCK_CATEGORIES } from '../constants';
import Api from '../services/api';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import Spinner from '../components/Spinner';
import VendorInfo from '../components/VendorInfo';
import SortProducts from '../components/SortProducts';
import CategoryBlock from '../components/CategoryBlock';
import ProductListView from '../components/ProductListView';

import * as nav from '../services/navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import base64 from 'react-native-base64';
import products from '../reducers/products';
const GOOGLE_PLACES_API_KEY = 'AIzaSyB1HvUvKrVcLRZ2PGNiThWYdvap3S9szzk';

import { selectedMin, selectedMax } from '../components/SortProducts';
import { filter } from 'lodash';



var slider_min = selectedMin;
var slider_max = selectedMax;

var getplaceid = "";
var encryptbase = "";
export { encryptbase }
var getlocality = "";
var vendorproductid = 0;

var vendorresponse = "";

var productsname = "";

var vendorproduct = "";

var productamount = "";

var productamounts = productamount.split('.')[0];

var productimage = "";



// Styles
const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    emptyList: {
        fontSize: '1rem',
        textAlign: 'center',
        color: '$darkColor',
        marginTop: '1rem',
    },
    loadingProductView: {
        borderRadius: '$borderRadius',
        backgroundColor: '$mediumGrayColor',
        margin: 5,
        height: PRODUCT_IMAGE_WIDTH + 85,
        width: `${Math.floor(94 / PRODUCT_NUM_COLUMNS)}%`,
    },
    text: {
        color: '$buttonWithoutBackgroundTextColor',
        fontSize: '0.9rem',
    },
    locationtext: {
        color: 'black',
        fontSize: '0.9rem',
        marginTop: 12
    },

    wrapper: {

        padding: 8,
        paddingLeft: 14,
        paddingRight: 14,
        flex: 1,
        justifyContent: 'space-between',
    },
    wrapperrow: {

        padding: 8,
        paddingLeft: 14,
        paddingRight: 14,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

//  export const Categories vendorDetail = ({

//   productsActions,

// }) => {
//   const [product, setProduct] = useState('');

//   const fetchData = async (currentPid) => {
//     const vendorProduct = await productsActions.fetch(currentPid);

//   }

// }

/**
 * Renders categories screen.
 *
 * @reactProps {object} navigator - Navigator.
 * @reactProps {number, string} categoryId - Category id.
 * @reactProps {number, string} companyId - Company id.
 * @reactProps {object} category - Category information.
 * @reactProps {object} vendors - Vendors information.
 * @reactProps {object} products - Products information.
 * @reactProps {object} layouts - Information about all blocks from the main page.
 * @reactProps {object} productsActions - Products actions.
 */
export class Categories extends Component {
    /**
     * @ignore
     */
    static propTypes = {
        categoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        companyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        category: PropTypes.shape({}),
        vendors: PropTypes.shape({
            items: PropTypes.object,
        }),
        products: PropTypes.shape({
            items: PropTypes.object,
        }),
        layouts: PropTypes.shape({
            blocks: PropTypes.arrayOf(PropTypes.shape({})),
        }),
        productsActions: PropTypes.shape({
            fetchByCategory: PropTypes.func,
        }),
        productsActions: PropTypes.shape({
            fetchByVendorlocation: PropTypes.func,
        })
    };

    constructor(props) {
        super(props);
        this.activeCategoryId = 0;
        this.isFirstLoad = true;

        this.state = {
            filters: '',
            products: [vendorproduct],
            subCategories: [],
            refreshing: false,
            isLoadMoreRequest: false,
            isSortChanging: false,
            fadeAnim: new Animated.Value(0.7),
        };
    }

    /**
    * Collects the content of the selected category.
    */
    async componentDidMount() {
        const { products, categoryId, layouts } = this.props;

        let { category } = this.props;

        if (categoryId) {
            const categories = layouts.blocks.find(
                (b) => b.type === BLOCK_CATEGORIES,
            );
            const items = Object.keys(categories.content.items).map(
                (k) => categories.content.items[k],
            );
            category = this.findCategoryById(items);
        }
        this.activeCategoryId = category.category_id;
        const categoryProducts = products.items[this.activeCategoryId];
        const newState = {};

        if ('subcategories' in category && category.subcategories.length) {
            newState.subCategories = category.subcategories;
        }

        if (categoryProducts) {
            newState.refreshing = false;
            newState.products = categoryProducts;
        }

        getlocality = "";
        encryptbase = "";

        this.setState(
            (state) => ({
                ...state,
                ...newState,
            }),
            this.handleLoad,
        );

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: category.category,
                },
            },
        });
    }

    /**
     * Collects the content of the selected category.
     */


    /**
     * Updates products in the state.
     *
     * @param {*} nextProps - Incoming props.
     */
    componentWillReceiveProps(nextProps) {
        const { products } = nextProps;
        const categoryProducts = products.items[this.activeCategoryId];
        if (categoryProducts) {
            this.setState({
                products: categoryProducts,
                refreshing: false,
            });
            this.isFirstLoad = false;
        }
    }

    /**
     * Loads products with selected filters.
     * @param {number} page - Number of pages.
     */
    handleLoad = async (page = 1) => {
        const { products, productsActions, companyId } = this.props;
        const { filters } = this.state;

        return await productsActions.fetchByCategory(
            this.activeCategoryId,
            page,
            companyId,
            {
                ...products.sortParams,
                features_hash: filters + '_5-' + encryptbase || filters.features_hash,

            },
        );
    };

    vendorhandleLoad = async (page = 1) => {
        const { products, productsActions, companyId } = this.props;
        const { filters } = this.state;

        return await productsActions.fetchByVendorlocation(
            this.activeCategoryId,
            page,
            companyId,
            {
                ...products.sortParams,
                features_hash: filters + '_5-' + encryptbase || filters.features_hash,
                // features_hash: filters || `1-${selectedMin}-${selectedMax}`+'_5-'+encryptbase,

            },
        );
    };

    /**
     * Returns all products with the selected category id.
     *
     * @param {object[]} items - All product information.
     */
    findCategoryById(items) {
        const { categoryId } = this.props;
        const flatten = [];
        const makeFlat = (list) => {
            list.forEach((i) => {
                flatten.push(i);
                if ('subcategories' in i) {
                    makeFlat(i.subcategories);
                }
            });
        };
        makeFlat(items);
        return flatten.find((i) => i.category_id == categoryId) || null;
    }

    /**
     * Auto-pagination.
     */
    handleLoadMore() {
        const { products } = this.props;
        const { isLoadMoreRequest } = this.state;

        if (products.hasMore && !isLoadMoreRequest) {
            this.setState({
                isLoadMoreRequest: true,
            });
            this.handleLoad(products.params.page + 1).then(() => {
                this.setState({
                    isLoadMoreRequest: false,
                });
            });
        }
    }

    vendorhandleLoadMore() {
        const { products } = this.props;
        const { isLoadMoreRequest } = this.state;

        if (products.hasMore && !isLoadMoreRequest) {
            this.setState({
                isLoadMoreRequest: true,
            });
            this.vendorhandleLoad(products.params.page + 1).then(() => {
                this.setState({
                    isLoadMoreRequest: false,
                });
            });
        }
    }

    /**
     * Refresh products data.
     */
    handleRefresh() {
        this.setState(
            {
                refreshing: true,
            },
            this.handleLoad,
        );
    }

    vendorhandleRefresh() {
        this.setState(
            {
                refreshing: true,
            },
            this.vendorhandleLoad,
        );
    }

    /**
     * Renders a sorted section.
     *
     * @return {JSX.Element}
     */
    renderSorting() {
        const { productsActions, products } = this.props;

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.fadeAnim, {
                    toValue: 0.3,
                    duration: 275,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.fadeAnim, {
                    toValue: 0.7,
                    duration: 275,
                    useNativeDriver: false,
                }),
            ]),
            { iterations: 10 },
        );

        return (
            <SortProducts
                sortParams={products.sortParams}
                filters={products.filters}
                onChange={async (sort) => {
                    animation.start();
                    this.setState({ isSortChanging: true });
                    await productsActions.changeSort(sort);
                    await this.handleLoad();
                    this.setState({ isSortChanging: false });
                }}
                onChangeFilter={(filters) => {
                    this.setState({ filters }, this.handleLoad);
                }}

            />
        );
    }

    vendorrenderSorting() {
        const { productsActions, products } = this.props;

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.fadeAnim, {
                    toValue: 0.3,
                    duration: 275,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.fadeAnim, {
                    toValue: 0.7,
                    duration: 275,
                    useNativeDriver: false,
                }),
            ]),
            { iterations: 10 },
        );

        return (
            <SortProducts
                sortParams={products.sortParams}
                filters={products.filters}
                onChange={async (sort) => {
                    animation.start();
                    this.setState({ isSortChanging: true });
                    await productsActions.changeSort(sort);
                    await this.vendorhandleLoad();
                    this.setState({ isSortChanging: false });
                }}
                onChangeFilter={(filters) => {
                    this.setState({ filters }, this.vendorhandleLoad);
                }}

            />
        );
    }

    renderlocationvendorList() {
        const { products, refreshing } = this.state;

        return (
            // <FlatList
            //   data={products}
            //   keyExtractor={(item) => +item.vendorproductid}
            //   ListHeaderComponent={() => this.renderHeader()}
            //   ListFooterComponent={() => this.renderFooter()}
            //   numColumns={PRODUCT_NUM_COLUMNS}
            //   renderItem={
            //     this.state.isSortChanging
            //       ? () => this.renderEmptyProductListView()
            //       : (item) => this.rendervendorProductListView(item)
            //   }
            //   onRefresh={() => this.handleRefresh()}
            //   refreshing={refreshing}
            //   onEndReachedThreshold={1}
            //   onEndReached={() => this.handleLoadMore()}
            //   ListEmptyComponent={() => this.renderEmptyList()}
            // />
            <View style={styles.container}>
                {products.fetching && this.isFirstLoad
                    ? this.renderSpinner()
                    : this.newrenderList()}



            </View>
        );
    }

    /**
     * Renders header.
     *
     * @return {JSX.Element}
     */
    renderHeader() {
        const { companyId, vendors } = this.props;

        let vendorHeader = null;
        if (companyId && vendors.items[companyId] && !vendors.fetching) {
            const vendor = vendors.items[companyId];
            vendorHeader = (
                <VendorInfo
                    onViewDetailPress={() => {
                        nav.showModalVendorDetail({ vendorId: companyId });
                    }}
                    logoUrl={vendor.logo_url}
                    productsCount={vendor.products_count}
                />
            );
        }

        return (
            <View style={styles.wrapper}>

                <Text style={styles.text} numberOfLines={2}>
                    {i18n.t('Choose Vendor City')}
                </Text>
                <View style={styles.wrapperrow}>



                    <GooglePlacesAutocomplete
                        placeholder='Enter a location'
                        keepResultsAfterBlur={true}

                        textInputProps={{ onBlur: () => { console.log("location") } }}
                        onPress={(data, details) => {

                            // 'details' is provided when fetchDetails = true
                            console.log("Searchlocation:", data.place_id);
                            console.log("searchlocality", details.terms[0].value);


                            getplaceid = data.place_id
                            getlocality = details.terms[0].value

                            console.log("getplaceid", getplaceid);
                            console.log("getlocality", getlocality);
                            console.log("locationbase64:", getplaceid + "|IN||" + getlocality)
                            encryptbase = base64.encode(getplaceid + "|IN||" + getlocality);
                            console.log("encodebase64", encryptbase);

                            const { products, categoryId, layouts } = this.props;

                            let { category } = this.props;

                            if (categoryId) {
                                const categories = layouts.blocks.find(
                                    (b) => b.type === BLOCK_CATEGORIES,
                                );
                                const items = Object.keys(categories.content.items).map(
                                    (k) => categories.content.items[k],
                                );
                                category = this.findCategoryById(items);
                            }
                            this.activeCategoryId = category.category_id;
                            const categoryProducts = products.items[this.activeCategoryId];
                            const newState = {};

                            if ('subcategories' in category && category.subcategories.length) {
                                newState.subCategories = category.subcategories;
                            }

                            if (categoryProducts) {
                                newState.refreshing = false;
                                newState.products = categoryProducts;
                            }

                            this.setState(
                                (state) => ({
                                    ...state,
                                    ...newState,
                                }),
                                this.handleLoad,

                            );



                        }}

                        // listViewDisplayed={false}
                        //fetchDetails={true}
                        keyboardShouldPersistTaps={"always"}
                        query={{
                            key: GOOGLE_PLACES_API_KEY,
                            language: 'en'
                        }}
                    />
                    <Text style={styles.locationtext}>{getlocality}</Text>
                    <Image source={require('./../assets/location.png')} style={{ marginTop: 10, marginLeft: 10 }} />

                </View>

                {vendorHeader}
                <CategoryBlock
                    items={this.state.subCategories}
                    onPress={(category) => {
                        nav.pushCategory(this.props.componentId, { category, companyId });
                    }}
                />
                {this.renderSorting()}
            </View>
        );
    }

    vendorrenderHeader() {
        const { companyId, vendors } = this.props;

        let vendorHeader = null;
        if (companyId && vendors.items[companyId] && !vendors.fetching) {
            const vendor = vendors.items[companyId];
            vendorHeader = (
                <VendorInfo
                    onViewDetailPress={() => {
                        nav.showModalVendorDetail({ vendorId: companyId });
                    }}
                    logoUrl={vendor.logo_url}
                    productsCount={vendor.products_count}
                />
            );
        }

        return (
            <View style={styles.wrapper}>

                <Text style={styles.text} numberOfLines={2}>
                    {i18n.t('Choose Vendor City')}
                </Text>
                <View style={styles.wrapperrow}>
                    <GooglePlacesAutocomplete
                        placeholder='Enter a location'
                        keepResultsAfterBlur={true}
                        textInputProps={{ onBlur: () => { console.log("location") } }}
                        onPress={(data, details) => {

                            // 'details' is provided when fetchDetails = true
                            console.log("Searchlocation:", data.place_id);
                            console.log("searchlocality", details.terms[0].value);


                            getplaceid = data.place_id
                            getlocality = details.terms[0].value

                            console.log("getplaceid", getplaceid);
                            console.log("getlocality", getlocality);
                            console.log("locationbase64:", getplaceid + "|IN||" + getlocality)
                            encryptbase = base64.encode(getplaceid + "|IN||" + getlocality);
                            console.log("encodebase64", encryptbase);

                            const { products, categoryId, layouts } = this.props;

                            let { category } = this.props;

                            if (categoryId) {
                                const categories = layouts.blocks.find(
                                    (b) => b.type === BLOCK_CATEGORIES,
                                );
                                const items = Object.keys(categories.content.items).map(
                                    (k) => categories.content.items[k],
                                );
                                category = this.findCategoryById(items);
                            }
                            this.activeCategoryId = category.category_id;
                            const categoryProducts = products.items[this.activeCategoryId];
                            const newState = {};

                            if ('subcategories' in category && category.subcategories.length) {
                                newState.subCategories = category.subcategories;
                            }

                            if (categoryProducts) {
                                newState.refreshing = false;
                                newState.products = categoryProducts;
                            }

                            this.setState(
                                (state) => ({
                                    ...state,
                                    ...newState,
                                }),
                                this.vendorhandleLoad,
                            );



                        }}

                        // listViewDisplayed={false}
                        //fetchDetails={true}
                        keyboardShouldPersistTaps={"always"}
                        query={{
                            key: GOOGLE_PLACES_API_KEY,
                            language: 'en'
                        }}
                    />
                    <Text style={styles.locationtext}>{getlocality}</Text>
                    <Image source={require('./../assets/location.png')} style={{ marginTop: 10, marginLeft: 10 }} />

                </View>

                {vendorHeader}
                <CategoryBlock
                    items={this.state.subCategories}
                    onPress={(category) => {
                        nav.pushCategory(this.props.componentId, { category, companyId });
                    }}
                />
                {this.vendorrenderSorting()}
            </View>
        );
    }

    /**
     * Renders spinner.
     *
     * @return {JSX.Element}
     */
    renderSpinner = () => <Spinner visible />;

    /**
     * Renders if there are no products in this section.
     */
    renderEmptyList = () => (
        <Text style={styles.emptyList}>
            {i18n.t('There are no products in this section')}
        </Text>
    );

    /**
     * Renders footer.
     *
     * @return {JSX.Element}
     */
    renderFooter() {
        const { products } = this.props;

        if (products.fetching && products.hasMore) {
            return <ActivityIndicator size="large" animating />;
        }

        return null;
    }

    renderProductListView(item) {
        return (
            <ProductListView
                product={item}
                onPress={(item) =>
                    nav.pushProductDetail(this.props.componentId, {
                        pid: item.product_id,
                    })
                }
            />
        );
    }

    rendervendorProductListView(item) {
        return (
            <ProductListView
                product={item}
                onPress={(item) =>
                    nav.pushProductDetail(this.props.componentId, {
                        pid: item.vendorproductid,
                    })
                }
            />
        );
    }

    renderEmptyProductListView() {
        return (
            <Animated.View
                style={[styles.loadingProductView, { opacity: this.state.fadeAnim }]}
            />
        );
    }

    /**
     * Renders products.
     *
     * @return {JSX.Element}
     */
    renderList() {

        const { products, refreshing } = this.state;

        return (
            <FlatList
                data={products}
                keyExtractor={(item) => +item.product_id}
                ListHeaderComponent={() => this.renderHeader()}
                ListFooterComponent={() => this.renderFooter()}
                numColumns={PRODUCT_NUM_COLUMNS}
                renderItem={
                    this.state.isSortChanging
                        ? () => this.renderEmptyProductListView()
                        : (item) => this.renderProductListView(item)
                }
                onRefresh={() => this.handleRefresh()}
                refreshing={refreshing}
                onEndReachedThreshold={1}
                onEndReached={() => this.handleLoadMore()}
                ListEmptyComponent={() => this.renderEmptyList()}
            />
        );

    }

    vendorrenderList() {

        const { products, refreshing } = this.state;

        return (
            <FlatList
                data={products}
                keyExtractor={(item) => +item.product_id}
                ListHeaderComponent={() => this.vendorrenderHeader()}
                ListFooterComponent={() => this.renderFooter()}
                numColumns={PRODUCT_NUM_COLUMNS}
                renderItem={
                    this.state.isSortChanging
                        ? () => this.renderEmptyProductListView()
                        : (item) => this.rendervendorProductListView(item)
                }
                onRefresh={() => this.vendorhandleRefresh()}
                refreshing={refreshing}
                onEndReachedThreshold={1}
                onEndReached={() => this.vendorhandleLoadMore()}
                ListEmptyComponent={() => this.renderEmptyList()}
            />
        );
    }

    /**
     * Renders component
     *
     * @return {JSX.Element}
     */
    render() {
        const { products } = this.props;
        return (



            <View style={styles.container}>
                {products.fetching && this.isFirstLoad
                    ? this.renderSpinner()
                    : this.renderList()}

            </View>
        );
    }
}

export default connect(
    (state) => ({
        products: state.products,
        layouts: state.layouts,
        vendors: state.vendors,
    }),
    (dispatch) => ({
        productsActions: bindActionCreators(productsActions, dispatch),
    }),
)(Categories);
