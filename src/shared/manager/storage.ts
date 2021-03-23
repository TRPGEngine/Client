import { buildRegFn } from './buildRegFn';

interface StorageObject {
  set: (key: string, data: any) => Promise<void>;
  get: (key: string, defaultVal?: any) => Promise<any>;
  remove: (key: string) => Promise<void>;
  save: (key: string, data: any) => Promise<void>;
}

/**
 * 持久化存储相关逻辑
 */
export const [getStorage, setStorage] = buildRegFn<() => StorageObject>(
  'trpgStorage'
);
