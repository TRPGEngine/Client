import { buildRegFn } from './buildRegFn';

export interface StorageObject {
  /**
   * NOTICE: 与save不同， set存储 1 天
   */
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
