import { setTokenGetter } from '@shared/manager/request';
import { getStorage, setStorage } from '@shared/manager/storage';
import { setToasts } from '@shared/manager/ui';
import { PORTAL_JWT_KEY } from '@shared/utils/consts';
import { showToast } from '@tarojs/taro';
import { miniProgramStorage } from './utils/storage';

setTokenGetter(async () => {
  const token = await getStorage().get(PORTAL_JWT_KEY, '');

  return String(token);
});

setStorage(() => miniProgramStorage);

setToasts((msg, type = 'info') => {
  let icon: showToast.Option['icon'] = 'none';
  if (type === 'success') {
    icon = 'success';
  }
  // taro 不支持error 因为不是所有的小程序都支持error
  // 可以考虑后期使用portal来实现类似操作

  showToast({
    title: msg,
    duration: 3000,
    icon,
  });
});
