import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import orderBy from 'lodash/orderBy';

import CategoryListView from './CategoryListView';
import i18n from '../utils/i18n';
import { PRODUCT_NUM_COLUMNS } from '../utils';


const styles = EStyleSheet.create({
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
      const { width } = Dimensions.get('window');
      const itemWidth = (width / 100) * Math.floor(94 / PRODUCT_NUM_COLUMNS + 5);

    if (!items.length) {
      return null;
    }

      let contentContainerStyleWidthIndex = items.length
      if (contentContainerStyleWidthIndex === 1) {
          contentContainerStyleWidthIndex *= PRODUCT_NUM_COLUMNS
      }


    const itemsList = orderBy(items, (i) => parseInt(i.position, 10), [
      'asc',
    ]).map((item, index) => (
      <CategoryListView
        category={item}
        onPress={() => onPress(item)}
        key={index}
      />
    ));

    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <Text style={styles.header}>{i18n.t('Product Catalog')}</Text>
        )}

            <ScrollView
                contentContainerStyle={{
                    width: (itemWidth + 1000),
                }}
                showsHorizontalScrollIndicator={false}
                horizontal>
                {orderBy(items, (i) => parseInt(i.position, 10), [
                    'asc',
                ]).map((item, index) => (
                     <CategoryListView
                        category={item}
                           onPress={() => onPress(item)}
                               key={index}
                        /> 
                ))}
            </ScrollView>
      </View>
    );
  }
}
