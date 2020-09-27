import { GroupInfo } from '@redux/types/group';
import { isGroupManager } from '@shared/model/group';
import { GroupPanel } from '@shared/types/panel';
import _isNil from 'lodash/isNil';

/**
 * 判断团面板是否可见
 * @param groupPanelInfo 团面板信息
 * @param userUUID 当前用户的UUID
 */
export function isGroupPanelVisible(
  groupInfo?: GroupInfo,
  groupPanelInfo?: GroupPanel,
  currentUserUUID?: string
): boolean {
  if (_isNil(groupInfo) || _isNil(groupPanelInfo) || _isNil(currentUserUUID)) {
    return false;
  }

  switch (groupPanelInfo.visible) {
    case 'all':
      return true;
    case 'manager':
      return isGroupManager(groupInfo, currentUserUUID);
    case 'assign':
      return groupPanelInfo.members.includes(currentUserUUID);
    default:
      return false;
  }
}
