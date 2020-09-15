import '@shared/i18n';
import '../shared/utils/common';
import { setToasts, setAlert } from '@shared/manager/ui';
import { message, Modal } from 'antd';
import _isFunction from 'lodash/isFunction';
import { injectLogoutSuccessCallback } from '@shared/utils/inject';

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
