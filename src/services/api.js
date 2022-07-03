import axios from 'axios';
import base64 from 'base-64';
import config from '../config';
import store from '../store';
import { AUTH_LOGOUT, SHOP_CLOSED } from '../constants';

// Config axios defaults.
const AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 100000,
});

AxiosInstance.interceptors.request.use((conf) => {
  const state = store.getState();
  const newConf = { ...conf };

  newConf.headers.common['Storefront-Api-Access-Key'] = config.apiKey;
  newConf.headers.common['Cache-Control'] = 'no-cache';

  newConf.params = conf.params || {};
  newConf.params.sl = state.settings.selectedLanguage.langCode;
  newConf.params.items_per_page = 20;
  newConf.params.s_layout = state.settings.layoutId;
  newConf.params.lang_code = state.settings.selectedLanguage.langCode;
  newConf.params.currency = state.settings.selectedCurrency.currencyCode;

  if (state.auth.token) {
    newConf.headers.common.Authorization = `Basic ${base64.encode(
      state.auth.token,
    )}:`;
  }

  return newConf;
});

AxiosInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch({
        type: AUTH_LOGOUT,
      });
    } else if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A time happend on url ${error.config.url}`);
    } else if (error.response.status === 404) {
      store.dispatch({
        type: SHOP_CLOSED,
      });
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
