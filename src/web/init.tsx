import { setToasts } from '@shared/manager/ui';
import { message } from 'antd';

setToasts((msg, type = 'info') => {
  message.open({
    type,
    duration: 3,
    content: msg,
  });
});
