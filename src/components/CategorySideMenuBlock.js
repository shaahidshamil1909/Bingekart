import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import orderBy from 'lodash/orderBy';

import CategorySideMenuListView from './CategorySideMenuListView';
import i18n from '../utils/i18n';

const styles = EStyleSheet.create({
    container: {
        backgroundColor: '$categoriesBackgroundColor',
        flex: 1,
    },
    wrapper: {
        backgroundColor: '#16264C',
        width: '100%',
        height: 450,
        padding: 15,
        borderColor: '#e3e3e3',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        fontWeight: 'bold',
        fontSize: '1.3rem',
        paddingLeft: 13,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 1,
        color: '#efff',
        textAlign: 'left',

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

});

/**
 * Renders a block with product categories.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - If passed, then the block name is rendered.
 * @reactProps {objects[]} items - An array of objects describing each category.
 * @reactProps {function} onPress - Push function.
 */
export default class CategoriesBlocks extends Component {
    /**
     * @ignore
     */
    static propTypes = {
        wrapper: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.object),
        onPress: PropTypes.func,
    };

    /**
     * @ignore
     */
    static defaultProps = {
        items: [],
    };

    /**
     * Renders component.
     *
     * @returns {JSX.Element}
     */
    render() {
        const { items, wrapper, onPress } = this.props;

        if (!items.length) {
            return null;
        }

        const itemsList = orderBy(items, (i) => parseInt(i.position, 3), [
            'asc',
        ]).map((item, index) => (
            <CategorySideMenuListView
                category={item}
                onPress={() => onPress(item)}
                key={index}
            />
        ));

        return (
            <View>
                    
                {wrapper !== '' && (
                    <Text style={styles.header}>{i18n.t('Categories')}</Text>
                )}
                <View style={styles.wrapper}>{itemsList}</View>
            </View>
        );
    }
}
