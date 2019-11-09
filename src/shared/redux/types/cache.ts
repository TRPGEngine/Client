import { Map } from 'immutable';

type CacheMap = Map<string, any>;

export type CacheKey =
  | 'user'
  | 'template'
  | 'actor'
  | 'group'
  | 'friendInvite'
  | 'groupInvite';

export type CacheState = Map<CacheKey, CacheMap>;
