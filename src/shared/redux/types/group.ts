import { Record, Map, List } from 'immutable';
import { ActorType } from './actor';

export type GroupType = 'group' | 'channel' | 'test';

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

export interface GroupInfo {
  id: number;
  uuid: string;
  type: GroupType;
  name: string;
  sub_name: string;
  desc: string;
  avatar: string;
  max_member: number;
  allow_search: boolean;
  creator_uuid: string;
  owner_uuid: string;

  managers_uuid?: string[];
  maps_uuid?: string[];

  // group初始化后获取的参数
  group_actors?: any[];
  group_members?: string[];
  extra?: any;
  status?: boolean;
}

export type GroupState = {
  info: { [name: string]: any };
  invites: any[];
  groups: GroupInfo[];
  selectedGroupUUID: string;
  isFindingGroup: boolean;
  findingResult: any[];
  requestingGroupUUID: string[];
  groupActorMap: {
    [name: string]: {
      [name: string]: string;
    };
  };
};
