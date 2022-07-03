import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18nManager, Image, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { get } from 'lodash';
import { stripTags } from '../utils';
import { AppCarousel } from '../components/AppCarousel';

const styles = EStyleSheet.create({
  img: {
    width: 'auto',
    height: '100%',
    resizeMode: 'contain',
  },
  textBannerWrapper: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textBanner: {
    textAlign: 'center',
    fontSize: '1.3rem',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: '$categoriesHeaderColor',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  dotsSwiper: {},
});

/**
 * Block with banners inside the swiper.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - If passed, then the block name is rendered.
 * @reactProps {object[]} items - An array of objects describing each banner.
 * @reactProps {function} onPress - Go to banner detail page.
 */
export default class BannerBlocks extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    name: PropTypes.string,
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
   * Renders image.
   *
   * @param {object} item - Banner information.
   * @param {number} index - Banner index.
   */
  renderImage = (slide, index) => {
    const { item } = slide;
    const imageUri = get(item, 'main_pair.icon.image_path');
    const { onPress } = this.props;

    return (
      <TouchableOpacity key={index} onPress={() => onPress(item)}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.img} />
        ) : (
          <View style={styles.textBannerWrapper}>
            <Text style={styles.textBanner}>{stripTags(item.description)}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Renders component.
   *
   * @returns {JSX.Element}
   */
  render() {
    const { items, name, wrapper } = this.props;

    return (
      <View style={styles.container}>
        {wrapper !== '' && <Text style={styles.header}>{name}</Text>}
        <AppCarousel
          items={items}
          renderItem={this.renderImage}
          carouselContainerHeight={250}
        />
      </View>
    );
  }
}
