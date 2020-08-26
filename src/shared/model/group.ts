import { GroupInfo } from '@redux/types/group';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';
import { request } from '@shared/utils/request';

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
  type: string
) {
  const { data } = await request.post(`/group/${groupUUID}/panel/create`, {
    name,
    type,
  });

  return data;
}
