import { Record, Map } from 'immutable';

export type CacheState = Record<{
  user: Map<string, any>;
  template: Map<string, any>;
  actor: Map<string, any>;
  group: Map<string, any>;
}>;
