import { setTokenGetter } from '@shared/manager/request';
import { getStorage, setStorage } from '@shared/manager/storage';
import { PORTAL_JWT_KEY } from '@shared/utils/consts';
import Taro from '@tarojs/taro';

setTokenGetter(async () => {
  const token = await getStorage().get(PORTAL_JWT_KEY, '');

  return String(token);
});

setStorage(() => {
  return {
    async set(key, data) {
      /**
       * NOTICE: Taro 不管过期
       * 此处行为与save一致
       */
      await Taro.setStorage({
        key,
        data,
      });
    },
    async get(key, defaultVal) {
      try {
        const { data } = await Taro.getStorage({
          key,
        });

        return data ?? defaultVal;
      } catch (e) {
        return defaultVal;
      }
    },
    async remove(key) {
      await Taro.removeStorage({
        key,
      });
    },
    async save(key, data) {
      await Taro.setStorage({
        key,
        data,
      });
    },
  };
});
