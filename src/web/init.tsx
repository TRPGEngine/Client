import '@shared/i18n';
import '../shared/utils/common';
import { setToasts, setAlert, setGlobalLoading } from '@shared/manager/ui';
import { message, Modal } from 'antd';
import _isFunction from 'lodash/isFunction';
import { injectLogoutSuccessCallback } from '@shared/utils/inject';
import { SERVICE_URL } from '@shared/utils/consts';
import { API } from '@shared/api/socket-api';
import { isUrl } from '@shared/utils/string-helper';
import config from '@shared/project.config';
import { initAnalytics } from './utils/analytics-helper';

initAnalytics();

const customServiceUrl = window.localStorage[SERVICE_URL];
if (isUrl(customServiceUrl)) {
  console.log('检测到自定义远程服务器地址:', customServiceUrl);
  API.serviceUrl = customServiceUrl; // 重写ws接口
  config.url.api = customServiceUrl.replace(/^wss?:/, 'http:'); // 重写http接口
}

setToasts((msg, type = 'info') => {
  message.open({
    type,
    duration: 3,
    content: String(msg),
  });
});

setAlert((options) => {
  Modal.confirm({
    content: options.message,
    onOk: async () => {
      _isFunction(options.onConfirm) && (await options.onConfirm());
    },
  });
});

setGlobalLoading((msg: React.ReactNode) => {
  const closeFn = message.loading(msg, 0);

  return closeFn;
});

injectLogoutSuccessCallback(() => {
  window.location.reload();
});
