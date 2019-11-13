import axios from 'axios';
import config from '@src/shared/project.config';
import _get from 'lodash/get';
import history from '../history';
import { getToken } from './auth';

export const request = axios.create({
  baseURL: config.url.api,
});

request.interceptors.request.use((val) => {
  if (!val.headers['X-Token']) {
    // 任何请求都尝试增加token
    val.headers['X-Token'] = getToken();
  }

  return val;
});

request.interceptors.response.use(
  (val) => val,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.log('未登录: 正在跳转到登录页面...');
      const pathname = window.location.pathname;
      const next = encodeURIComponent(pathname);
      history.push(`/sso/login?next=${next}`);
      return;
    }

    // 尝试获取msg
    throw _get(err, 'response.data.msg', err);
  }
);
