import type { GroupPanel } from '@shared/types/panel';
// import type { ActorType } from './actor'; // TODO
import type { MsgPayload } from './chat';
import type { UserInfo } from './user';

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
  actor_info?: {}; // 当通过审批以后会保存一份。未通过的到actor中查看
  actor_template_uuid?: string; // 当通过审批以后会保存一份。未通过的到actor中查看
  // actor: ActorType;
  actor: any; // TODO

  owner?: Pick<UserInfo, 'uuid'>;
}

export interface GroupDetail {
  master_name: string;
  disable_check_actor: boolean;
  disable_check_actor_in_chat: boolean;
  background_image_url: string;
  welcome_msg_payload: MsgPayload;
  allow_quick_dice: boolean;
  disable_system_notify_on_actor_updated: boolean;
}

type GroupChannelVisible = 'all' | 'manager' | 'assign';

/**
 * @deprecated 不直接通过channel实现管理，而通过panel实现相关信息
 */
export interface GroupChannel {
  uuid: string;
  name: string;
  desc: string;
  visible: GroupChannelVisible;
  members: string[];
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
  rule?: string;
  creator_uuid: string;
  owner_uuid: string;

  managers_uuid?: string[];
  /**
   * @deprecated
   */
  maps_uuid?: string[];
  maps?: { name: string; uuid: string }[]; // 地图列表

  detail?: GroupDetail; // 一开始不存在需要保存后才生成
  channels?: GroupChannel[];

  // group初始化后获取的参数
  group_actors?: GroupActorType[];
  group_members?: string[];
  panels?: GroupPanel[];
  extra?: any;
  status?: boolean;
}

export type GroupState = {
  info: { [name: string]: any };
  invites: any[];
  groups: GroupInfo[];

  /**
   * @deprecated 弃用 对于新版来说统一用chat.selectedConverseUUID即可满足需求
   */
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
