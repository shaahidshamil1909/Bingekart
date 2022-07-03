import { Navigation } from 'react-native-navigation';
import { initApp } from './appActions';
import * as nav from '../services/navigation';
import { SET_LANGUAGE, SET_CURRENCY } from '../constants';

export const setLanguage = (language) => {
  return async (dispatch) => {
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
  };
};

export const setCurrency = (currency) => {
  return async (dispatch) => {
    dispatch({
      type: SET_CURRENCY,
      payload: currency,
    });
    await initApp();
    Navigation.setRoot(nav.setRoot());
  };
};
