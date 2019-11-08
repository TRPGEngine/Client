import { Record, Map } from 'immutable';

type CacheMap = Map<string, any>;

export interface CacheRecordProps {
  user: CacheMap;
  template: CacheMap;
  actor: CacheMap;
  group: CacheMap;
  friendInvite: CacheMap;
  groupInvite: CacheMap;
}

export type CacheState = Record<CacheRecordProps>;

export type CacheScope = keyof CacheRecordProps;
