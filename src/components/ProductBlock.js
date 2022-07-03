import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductListView from './ProductListView';
import { PRODUCT_NUM_COLUMNS } from '../utils';

const styles = EStyleSheet.create({
  container: {
    marginBottom: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    color: '$categoriesHeaderColor',
  },
});

/**
 * Renders product block.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - Renders name if exists.
 * @reactProps {object[]} items - Products information.
 * @reactProps {function} onPress - Opens a product.
 */
export default class ProductBlock extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    name: PropTypes.string,
    wrapper: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    items: [],
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { items, name, wrapper } = this.props;
    const { width } = Dimensions.get('window');
    const itemWidth = (width / 100) * Math.floor(94 / PRODUCT_NUM_COLUMNS + 5);

    // If ProductBlock has only one product we have to recalculate it's width.
    let contentContainerStyleWidthIndex = items.length
    if (contentContainerStyleWidthIndex === 1) {
      contentContainerStyleWidthIndex *= PRODUCT_NUM_COLUMNS
    }

    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>{name}</Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={{
            width: (itemWidth + 10) * contentContainerStyleWidthIndex,
          }}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {items.map((item, index) => (
            <ProductListView
              key={index}
              product={{ item }}
              onPress={() => this.props.onPress(item)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
