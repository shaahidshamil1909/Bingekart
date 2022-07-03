import React from 'react';
import PropTypes from 'prop-types';
import RenderHtml from 'react-native-render-html';
import { MAX_WINDOW_WIDTH } from '../utils';
import * as nav from '../services/navigation';

/**
 * Renders detail information.
 *
 * @param {string} description - Description text.
 * @param {number} id - Id for renderers props.
 * @param {string} title - Title for renderers props.
 *
 * @return {JSX.Element}
 */
 DetailDescription = ({description, id, title}) => {
    const horizontalPadding = 40;
    const descriptionWidth = MAX_WINDOW_WIDTH - horizontalPadding;
    const fullDescription = {html: description};
    const renderersProps = {
      a: {
        onPress: (event, href) => 
          nav.showPage(id, {
            title: title,
            uri: href,
          })
      }
    };

    return (
      <RenderHtml
        contentWidth={descriptionWidth}
        source={fullDescription}
        renderersProps={renderersProps}
      />
    )
};

/**
 * @ignore
 */
 DetailDescription.propTypes = {
  description: PropTypes.string,
  id: PropTypes.number,
  title: PropTypes.string,
};

export default DetailDescription;
