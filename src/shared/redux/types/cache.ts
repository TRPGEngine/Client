// type CacheMap = Map<string, any>;
type CacheMap = { [name: string]: any };

export type CacheKey =
  | 'user'
  | 'template'
  | 'actor'
  | 'group'
  | 'friendInvite'
  | 'groupInvite';

// export type CacheState = Map<CacheKey, CacheMap>;
export type CacheState = {
  [name in CacheKey]: CacheMap;
};
