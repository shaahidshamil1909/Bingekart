import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    fontSize: '0.8rem',
  },
  nameContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexGrow: 1.5,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'stretch',
    flexGrow: 1,

  }
});

/**
 * Renders row with name and value.
 *
 * @param {string} name - Row name.
 * @param {string} value - Row value.
 * @param {boolean} last - Last row in the list or not.
 *
 * @return {JSX.Element}
 */
const SectionRow = ({ name, value }) => {
  return (
    <View style={styles.row}>
      <View style={styles.nameContainer}>
        <Text style={styles.text}>{name}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  );
};

/**
 * @ignore
 */
SectionRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  last: PropTypes.bool,
};

export default SectionRow;
