import { Record, Map, List } from 'immutable';
import { ActorType } from './actor';

export interface GroupActorMsgData {
  groupActorUUID: string;
  name: string;
  avatar: string;
}

export interface GroupActorType {
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  passed: boolean;
  enabled: boolean;
  actor_uuid: string;
  actor_info: {};
  actor: ActorType;
}

export type GroupState = Record<{
  info: Map<string, any>;
  invites: List<any>;
  groups: List<any>;
  selectedGroupUUID: string;
  isFindingGroup: boolean;
  findingResult: List<any>;
  requestingGroupUUID: List<string>;
  groupActorMap: Map<string, Map<string, string>>;
}>;
