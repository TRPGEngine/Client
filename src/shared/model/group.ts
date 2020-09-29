import { GroupInfo } from '@redux/types/group';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _set from 'lodash/set';
import { request } from '@shared/utils/request';
import { PlayerUser } from './player';
import { isBlobUrl } from '@shared/utils/string-helper';
import { toGroupActorWithBlobUrl } from '@web/utils/upload-helper';
import { bindFileAvatarAttachUUID } from './file';
import { getJWTUserInfo } from '@shared/utils/jwt-helper';
import { GroupPanelVisible } from '@shared/types/panel';

export interface GroupItem {
  uuid: string;
  type: string;
  name: string;
  sub_name: string;
  desc: string;
  avatar: string;
  max_member: number;
  allow_search: boolean;
  creator_uuid: string;
  owner_uuid: string;
  managers_uuid: string[];
  maps_uuid: string[];
  rule: string;
}

export interface GroupActorItem {
  uuid: string;
  actor_uuid: string;
  actor_info: {};
  actor_template_uuid: string;
  name: string;
  desc: string;
  avatar: string;
  passed: boolean;
  enabled: boolean;

  owner?: PlayerUser;
}

export interface GroupInviteCodeInfo {
  id: number;
  code: string;
  group_uuid: string;
  from_uuid: string;
  expiredAt: string;
  times: number;
}

/**
 * 获取团信息
 * @param groupUUID 团UUID
 */
export async function fetchGroupInfo(groupUUID: string): Promise<GroupInfo> {
  const { data } = await request.get(`/group/${groupUUID}/info`);

  return data.group;
}

/**
 * 创建团
 */
export async function createGroup(
  name: string,
  desc: string
): Promise<GroupInfo> {
  const { data } = await request.post(`/group/create`, {
    name,
    desc,
  });

  return data.group;
}

/**
 * 将某位成员提升为管理员
 * @param groupUUID 团UUID
 * @param memberUUID 成员UUID
 */
export async function setMemberToManager(
  groupUUID: string,
  memberUUID: string
): Promise<void> {
  await request.post(`/group/setMemberToManager`, {
    groupUUID,
    memberUUID,
  });
}

/**
 * 将某位成员踢出团
 * @param groupUUID 团UUID
 * @param memberUUID 成员UUID
 */
export async function tickMember(
  groupUUID: string,
  memberUUID: string
): Promise<void> {
  await request.post(`/group/tickMember`, {
    groupUUID,
    memberUUID,
  });
}

/**
 * 创建团面板
 * @param groupUUID 团UUID
 * @param name 面板名
 * @param type 面板类型
 */
export async function createGroupPanel(
  groupUUID: string,
  name: string,
  type: string,
  extra: object
) {
  const { data } = await request.post(`/group/${groupUUID}/panel/create`, {
    name,
    type,
    extra,
  });

  return data;
}

/**
 * 更新团面板信息
 * @param info 要更新的内容
 */
export async function updateGroupPanelInfo(
  groupUUID: string,
  panelUUID: string,
  info: {
    name: string;
    visible: GroupPanelVisible;
    members?: string[];
  }
) {
  const { data } = await request.post(`/group/${groupUUID}/panel/updateInfo`, {
    panelUUID,
    info,
  });

  return data;
}

/**
 * 获取团邀请代码信息
 * @param inviteCode 邀请代码
 */
export async function fetchGroupInviteCodeInfo(
  inviteCode: string
): Promise<GroupInviteCodeInfo> {
  const { data } = await request.get(`/group/invite/code/${inviteCode}/info`);

  return data.invite;
}

/**
 * 创建团邀请码
 * @param groupUUID 团UUID
 */
export async function createGroupInviteCode(
  groupUUID: string
): Promise<GroupInviteCodeInfo> {
  const { data } = await request.post(`/group/invite/code/create`, {
    groupUUID,
  });

  return data.invite;
}

/**
 * 应用团邀请代码
 * @param inviteCode 邀请代码
 */
export async function applyGroupInviteCode(
  inviteCode: string
): Promise<boolean> {
  const { data } = await request.post(`/group/invite/code/${inviteCode}/apply`);

  return data.result;
}

/**
 * 同意团角色的申请
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 */
export const requestAgreeGroupActor = async (
  groupUUID: string,
  groupActorUUID: string
): Promise<GroupActorItem> => {
  const { data } = await request.post(`/group/${groupUUID}/actor/agree`, {
    groupActorUUID,
  });

  return data.groupActor;
};

/**
 * 拒绝团角色的申请
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 */
export const requestRefuseGroupActor = async (
  groupUUID: string,
  groupActorUUID: string
): Promise<void> => {
  await request.post(`/group/${groupUUID}/actor/refuse`, {
    groupActorUUID,
  });
};

/**
 * 编辑团角色信息
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 * @param groupActorInfo 团角色信息
 */
export async function editGroupActor(
  groupUUID: string,
  groupActorUUID: string,
  groupActorInfo: { [key: string]: any }
): Promise<GroupActorItem> {
  // 头像的修改与绑定
  const avatarUrl = _get(groupActorInfo, '_avatar');
  let avatar;
  if (_isString(avatarUrl) && isBlobUrl(avatarUrl)) {
    const userInfo = await getJWTUserInfo();
    avatar = await toGroupActorWithBlobUrl(userInfo.uuid!, avatarUrl);
    _set(groupActorInfo, '_avatar', avatar.url);
  }

  const { data } = await request.post(
    `/group/${groupUUID}/actor/${groupActorUUID}/edit`,
    {
      info: groupActorInfo,
    }
  );

  const groupActor: GroupActorItem = data.groupActor;

  if (!_isNil(avatar)) {
    // 如果有头像， 则绑定头像关系
    await bindFileAvatarAttachUUID(avatar.uuid, groupActor.uuid);
  }

  return groupActor;
}
