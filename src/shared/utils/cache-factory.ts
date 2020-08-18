import rnStorage from '@shared/api/rn-storage.api';
import _isNil from 'lodash/isNil';

export enum CachePolicy {
  /**
   * 存储在内存中
   */
  Temporary,

  /**
   * 存储在rnStorage中
   */
  Persistent,
}

function defaultHash(...args): string {
  return 'trpg:' + args.join('$');
}

export function buildCacheFactory<T>(
  policy: CachePolicy,
  fn: (...args: any[]) => any,
  hashFn: (...args: any[]) => string = defaultHash
): (...args: any[]) => Promise<T> {
  let cacheManager: CacheManager;
  if (policy === CachePolicy.Temporary) {
    cacheManager = new TemporaryCache();
  } else if (policy === CachePolicy.Persistent) {
    cacheManager = new PersistentCache();
  }

  return async (...args: any[]) => {
    const hash = hashFn(...args);

    const cache = await cacheManager.get(hash);
    if (!_isNil(cache)) {
      return cache;
    }

    const ret = await fn(...args);
    await cacheManager.set(hash, ret);

    return ret;
  };
}

interface CacheManager {
  get(hash: string): Promise<any>;

  set(hash: string, value: any): Promise<void>;
}

class TemporaryCache implements CacheManager {
  temporaryCacheMap = {};

  async get(hash: string) {
    return this.temporaryCacheMap[hash];
  }
  async set(hash: string, value: any) {
    this.temporaryCacheMap[hash] = value;
  }
}

class PersistentCache implements CacheManager {
  async get(hash: string) {
    return await rnStorage.get(hash);
  }
  async set(hash: string, value: any) {
    rnStorage.set(hash, value);
  }
}
