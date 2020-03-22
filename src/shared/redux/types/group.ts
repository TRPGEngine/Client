import { ActorType } from './actor';
import { MsgPayload } from './chat';
import { UserInfo } from './user';

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
  actor: ActorType;

  owner?: Pick<UserInfo, 'uuid'>;
}

export interface GroupDetail {
  master_name: string;
  disable_check_actor: boolean;
  background_image_url: string;
  welcome_msg_payload: MsgPayload;
  allow_quick_dice: boolean;
}

export interface GroupChannel {
  uuid: string;
  name: string;
  desc: string;
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
  maps_uuid?: string[];

  detail?: GroupDetail; // 一开始不存在需要保存后才生成
  channels?: GroupChannel[];

  // group初始化后获取的参数
  group_actors?: GroupActorType[];
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
