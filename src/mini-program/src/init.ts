import { setTokenGetter } from '@shared/manager/request';
import { getStorage, setStorage } from '@shared/manager/storage';
import { setToasts } from '@shared/manager/ui';
import { TARO_JWT_KEY } from '@shared/utils/consts';
import Taro from '@tarojs/taro';
import { miniProgramStorage } from './utils/storage';

setTokenGetter(async () => {
  const token = await getStorage().get(TARO_JWT_KEY, '');

  return String(token);
});

setStorage(() => miniProgramStorage);

setToasts((msg, type = 'info') => {
  Taro.atMessage({
    message: msg,
    type: type,
    duration: 3000,
  });
});
