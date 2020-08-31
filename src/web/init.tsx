import { setToasts, setAlert } from '@shared/manager/ui';
import { message, Modal } from 'antd';
import _isFunction from 'lodash/isFunction';

setToasts((msg, type = 'info') => {
  message.open({
    type,
    duration: 3,
    content: msg,
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
