import { GroupInfo } from '@redux/types/group';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';

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
