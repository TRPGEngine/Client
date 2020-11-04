import '@shared/i18n';
import '../shared/utils/common';
import { setToasts, setAlert } from '@shared/manager/ui';
import { message, Modal } from 'antd';
import _isFunction from 'lodash/isFunction';
import { injectLogoutSuccessCallback } from '@shared/utils/inject';
import { SERVICE_URL } from '@shared/utils/consts';
import { API } from '@shared/api/socket-api';
import { isUrl } from '@shared/utils/string-helper';

const customServiceUrl = window.localStorage[SERVICE_URL];
if (isUrl(customServiceUrl)) {
  console.log('检测到自定义远程服务器地址:', customServiceUrl);
  API.serviceUrl = customServiceUrl;
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

injectLogoutSuccessCallback(() => {
  window.location.reload();
});
