import React, { useContext } from 'react';
import type { GroupInfo } from '@redux/types/group';

/**
 * 记录当前所在团的信息上下文
 */

export const GroupInfoContext = React.createContext<GroupInfo | null>(null);
GroupInfoContext.displayName = 'GroupInfoContext';

/**
 * 获取当前组件所在位置的团UUID
 */
export function useCurrentGroupUUID(): string | undefined {
  const groupInfo = useContext(GroupInfoContext);

  return groupInfo?.uuid;
}
