import type { StorageObject } from '@shared/manager/storage';
import Taro from '@tarojs/taro';

export const miniProgramStorage: StorageObject = {
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
