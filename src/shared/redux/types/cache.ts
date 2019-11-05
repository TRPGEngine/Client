import { Record, Map } from 'immutable';

export interface CacheRecordProps {
  user: Map<string, any>;
  template: Map<string, any>;
  actor: Map<string, any>;
  group: Map<string, any>;
  groupInvite: Map<string, any>;
}

export type CacheState = Record<CacheRecordProps>;

export type CacheScope = keyof CacheRecordProps;
