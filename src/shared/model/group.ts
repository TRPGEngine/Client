import { GroupInfo } from '@redux/types/group';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';
import { request } from '@shared/utils/request';

export interface GroupInviteCodeInfo {
  id: number;
  code: string;
  group_uuid: string;
  from_uuid: string;
  expiredAt: string;
  times: number;
}

/**
 * 判断某个用户是否为团管理员
 * @param groupInfo 团信息
 */
export function isGroupManager(
  groupInfo: GroupInfo,
  userUUID: string
): boolean {
  if (_isNil(groupInfo) || _isNil(userUUID)) {
    return false;
  }

  return (
    groupInfo.owner_uuid === userUUID ||
    (_isArray(groupInfo.managers_uuid) &&
      groupInfo.managers_uuid.includes(userUUID))
  );
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
 * 应用团邀请代码
 * @param inviteCode 邀请代码
 */
export async function applyGroupInviteCode(
  inviteCode: string
): Promise<boolean> {
  const { data } = await request.post(`/group/invite/code/${inviteCode}/apply`);

  return data.result;
}
