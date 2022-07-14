import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { getImagePath } from '../utils';

const styles = EStyleSheet.create({
  container: {

  },
  wrapper: {
    flex: 1,
    minHeight: 70,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '$categoryBorderRadius',
    backgroundColor: '$categoryBlockBackgroundColor',
  },
  categoryImage: {
   
  },
  categoryTitleWrapper: {
  
    paddingLeft: 2,
    paddingRight: 4,
  },
  categoryTitle: {
    textAlign: 'left',
    fontSize: '0.9rem',
    paddingLeft: 4,
    paddingRight: 4,
   
    color: '#FFF',
  },
});

/**
 * Renders a category.
 *
 * @param {string} category - Category description.
 * @param {string} onPress - Push function.
 *
 * @return {JSX.Element}
 */
const CategorySideMenuListView = ({ category, onPress }) => {
  const imageUri = getImagePath(category);

  return (
    <TouchableOpacity
     // style={styles.container}
      onPress={() => onPress(category)}>
   
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={10} style={styles.categoryTitle}>
            {category.category}
          </Text>
       
      </View>
    </TouchableOpacity>
  );
};

/**
 * @ignore
 */
CategorySideMenuListView.propTypes = {
  category: PropTypes.shape({}),
  onPress: PropTypes.func,
};

export default CategorySideMenuListView;
