import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { socialLoginIconPaths } from '../utils/socialLoginIcons';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as nav from '../services/navigation';
import { connect, RootStateOrAny } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';

// Actions
import * as authActions from '../actions/authActions';

const styles = EStyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialLoginTitle: {
    marginBottom: 10,
  },
  socialLoginIconsWrapper: {
    flexDirection: 'row',
  },
  socialLoginIconWrapper: {
    margin: 5,
  },
  socialLoginIcon: {
    width: 30,
    height: 30,
  },
});

const SocialLinksBlock = ({
  componentId,
  isRegistration,
  settings,
}: {
  componentId: string;
  isRegistration: boolean;
}) => {
  if (!Object.keys(settings.socialLoginLinks).length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.socialLoginTitle}>
        {i18n.t('Or sign-in with another identity provider:')}
      </Text>
      <View style={styles.socialLoginIconsWrapper}>
        {Object.keys(settings.socialLoginLinks).map(
          (socialLoginName, index) => {
            return (
              <TouchableOpacity
                style={styles.socialLoginIconWrapper}
                key={index}
                onPress={() =>
                  nav.showSocialLogin(componentId, {
                    title: socialLoginName,
                    isRegistration,
                    uri: settings.socialLoginLinks[socialLoginName],
                  })
                }>
                <Image
                  style={styles.socialLoginIcon}
                  source={socialLoginIconPaths[socialLoginName]}
                />
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    settings: state.settings,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(SocialLinksBlock);
