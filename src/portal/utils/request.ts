import axios from 'axios';
import config from '@src/shared/project.config';
import history from '../history';

export const request = axios.create({
  baseURL: config.url.api,
  headers: {
    'X-Token': window.localStorage.getItem('jwt'),
  },
});

request.interceptors.response.use(
  (val) => {
    return val;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      console.log('未登录: 正在跳转到登录页面...');
      history.push('/sso/login');
      return;
    }

    console.error(err);
  }
);
